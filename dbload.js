var Excel = require('exceljs');	
var mongo = require('mongodb').MongoClient;
const csv = require('csv-parser')
const fs = require('fs');
const readjson = require('readjson');
const lev = require('js-levenshtein');

const personalTypes = [ 'Blackberry','iPad','IPHONE','Messagebank','Mobile Data Device','Mobile GPRS','Mobile GSM','Mobile OWB','Mobile Wi-Fi','Teleconference Card','Telstra Mobile Broadband']

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

var dbWithInventory = mongo.connect('mongodb://localhost:27017')
.then(function(client) {
	var db = client.db('temnames');
	return wipeDb(db);
})
.then(loadInventory)
.then((db) => Promise.all([
		loadHcm(db).then(hcmNormalizeName).then(hcmCrossMatch).then(hcmScore),
		loadAd(db).then(normalizeName).then(adCrossMatch).then(adScore)
	]))
.then((r)=> { console.log('done'); process.exit(0) })
.catch((e) => { console.log(e); process.exit(-1) })

function wipeDb(db) {
	console.log('wipeDb');
	return Promise.all(['hcm','inventory','adUsers','adCrossmatch','hcmCrossmatch'].map(coll => db.collection(coll).deleteMany({}))).then(()=>db);
}

function loadInventory(db) {
	console.log('loadInventory');
	return new Promise((resolve, reject) => {

		var invColl = db.collection('inventory');
		var invFile = new Excel.Workbook();

		invFile.xlsx.readFile('../billing+points.xlsx')
		.then((workbook) => {
			var insertPromises = [];
			var worksheet = workbook.getWorksheet('Data 1');
			for (var i = 1; i <= worksheet.rowCount; i++) {
				var row = worksheet.findRow(i);
				if (personalTypes.includes(row.values[2])) {
					insertPromises.push(invColl.insertMany([{
						name : row.values[4],
						names : tokenizeName(row.values[4]),
						number : row.values[3],
						employeeId : row.values[43],
						email : row.values[117]
					}]))
				}
			}
			return Promise.all(insertPromises)
		})
		.then((ip) => resolve(db))
		.catch((e) => reject(e))
	});
}

function loadAd(db) {
	console.log('loadAd');
	return new Promise((resolve, reject) => {

		try {
			var coll = db.collection('adUsers');
			var insertPromises = [];

			fs.createReadStream('../users.csv')
			.pipe(csv())
			.on('data', (data) => {

				insertPromises.push(
					coll.insertMany(
						[{
							dn : data.DN,
							lastname : data.sn,
							firstname : data.givenName,
							email : data.mail
						}]
					)
				)
			})
			.on('end',
				() => Promise.all(insertPromises).then(()=>resolve(db))
			);

		} catch (ex) {
			return Promise.reject(ex);
		}

	});
}

function adCrossMatch(db) {
	console.log('adCrossMatch');
	return promisifyAggregateCollection(db, 'inventory', 'adCrossmatch', 'adcrossmatch-pipeline.json');
}

function adScore(db) {
	console.log('adScore');
	return new Promise((resolve, reject) => {
		var updatePromises = [];
		var collection = db.collection('adCrossmatch');

		var cursor = collection.find();
		cursor.on('data', (doc) => {
			docFilter = { _id : doc._id };
			updatePromises.push(collection.replaceOne(docFilter, scoreOneDoc(doc, 'adNames')))
		});
		cursor.on('end', () => {
			Promise.all(updatePromises).then(resolve(db));
		});
	})
}

function scoreOneDoc(doc, subNameField) {
	doc[subNameField].map((n) => { n.score = lev(doc._id.toLowerCase(), n.normalisedName) });
	return doc;
}

function loadHcm(db) {
	console.log('loadHcm');
	return new Promise((resolve, reject) => {

		var invColl = db.collection('hcm');
		var invFile = new Excel.Workbook();

		invFile.xlsx.readFile('../Active Employee_07.03.2018.xlsx')
		.then((workbook) => {
			var insertPromises = [];
			var worksheet = workbook.getWorksheet('Sheet1');
			for (var i = 1; i <= worksheet.rowCount; i++) {
				var row = worksheet.findRow(i);
				insertPromises.push(invColl.insertMany([{
					number : row.values[1],
					firstname : row.values[3],
					lastname : row.values[4],
					companycode : row.values[10],
					title : row.values[26],
					emptype : row.values[22]
				}]))
			}
			return Promise.all(insertPromises)
		})
		.then((ip) => resolve(db))
		.catch((e) => reject(e))
	});
}

function hcmNormalizeName(db) {
	console.log('hcmNormalizeName');
	return promisifyAggregateCollection(db, 'hcm', 'hcm', 'hcmNormalizeName.json');
}

function hcmCrossMatch(db) {
	console.log('hcmCrossMatch');
	return promisifyAggregateCollection(db, 'inventory', 'hcmCrossmatch', 'hcmCrossmatch-pipeline.json');
}

function hcmScore(db) {
	console.log('hcmScore');
	return new Promise((resolve, reject) => {
		var updatePromises = [];
		var collection = db.collection('hcmCrossmatch');

		var cursor = collection.find();
		cursor.on('data', (doc) => {
			docFilter = { _id : doc._id };
			updatePromises.push(collection.replaceOne(docFilter, scoreOneDoc(doc, 'employeeNames')))
		});
		cursor.on('end', () => {
			Promise.all(updatePromises).then(resolve(db));
		});
	})
}

function tokenizeName(name) {
	// eliminate punctuation - well just commas to begin
	name.replace(',',' ');

	// tokenize on space
	return name.split(' ').map(s => s.toLowerCase());
}

function normalizeName(db) {
	console.log('normalizeName');
	return promisifyAggregateCollection(db, 'adUsers', 'adUsers', 'adNormalizeName.json')
}

function promisfyReadJson(path) {
	return new Promise((resolve, reject) => {
		readjson(path, (err,data)=>{if(!err) {resolve(data)}else{reject(err)}});
	});
}

function promisifyAggregateCollection(db, inCollectionName, outCollectionName, pipelineFile) {
	// https://stackoverflow.com/questions/48666648/out-stage-of-mongo-aggregation-pipeline-not-taking-effect-using-node
	//  need the toArray call on the Cursor returned from aggregate() to allow the $out stage of the pipeline to take effect
	return new Promise((resolve, reject) => {
		var collection = db.collection(inCollectionName);
		promisfyReadJson(pipelineFile)
		.then((pipeline) => collection.aggregate(pipeline).out(outCollectionName).toArray())
		.then(() => resolve(db))
		.catch((err) => reject(err));
	});
}
