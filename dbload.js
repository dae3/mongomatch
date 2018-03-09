var Excel = require('exceljs');
var mongo = require('mongodb').MongoClient;
var bamfile = new Excel.Workbook();
const csv = require('csv-parser')
const fs = require('fs');

const personalTypes = [ 'Blackberry','iPad','IPHONE','Messagebank','Mobile Data Device','Mobile GPRS','Mobile GSM','Mobile OWB','Mobile Wi-Fi','Teleconference Card','Telstra Mobile Broadband']

mongo.connect('mongodb://localhost:27017', function (err, client) {
	if (err == null) {
		console.log('db connected');
		var db = client.db('temnames')
		wipeDb(db);
		bamToDb(db);
		adCsvToDb(db);
		hcmCsvToDb(db);
	} else {
		console.log(`dbconnect: $err`);
	}
	
	// client.close();
});

function wipeDb(db) {
	['hcm','inventory','adUsers'].forEach(f => db.collection(f).deleteMany({}));
}

function hcmCsvToDb(db) {
	var coll = db.collection('hcm');
	bamfile.xlsx.readFile('../Active Employee_07.03.2018.xlsx').then(function () {
		var sheet = bamfile.getWorksheet('Sheet1');
		// 1: Emp #, 3: first, 4: last, 10: coy code, 26: title, 22: emptype (cas, etc.)
		
		sheet.eachRow( { includeEmpty : false }, function(row, num) {
			var emp = {
				number : row.values[1],
				firstname : row.values[3],
				lastname : row.values[4],
				companycode : row.values[10],
				title : row.values[26],
				emptype : row.values[22]
			};
			
			coll.insertMany([emp], function(err, res) { console.log(res) });
		});
	});
}
	

function adCsvToDb(db) {
	// fs.readStream('users.csv').pipe(parse).pipe(process.stdout);
	var coll = db.collection('adUsers');
	
	
	fs.createReadStream('users.csv')
		.pipe(csv())
		.on('data', function(data) {
			console.log(data.DN);
			
			coll.insertMany(
				[{
					dn : data.DN,
					lastname : data.sn,
					firstname : data.givenName,
					email : data.mail
				}], 
				function(err,res) { if (err != null) { console.log(err) } }
			);
		});	
	
}

function tokenizeName(name) {
	// eliminate punctuation - well just commas to begin
	name.replace(',',' ');
	
	// tokenize on space
	return name.split(' ').map(s => s.toLowerCase());
}

function bamToDb(db) {
	bamfile.xlsx.readFile('../billing+points.xlsx').then(function() {
		var bamdata = bamfile.getWorksheet('Data 1');
		var coll = db.collection('inventory');
		
		bamdata.eachRow( { includeEmpty : false }, function(row, num) {
			if (personalTypes.includes(row.values[2])) {
				var service = { name : row.values[4], names : tokenizeName(row.values[4]), number : row.values[3], employeeId : row.values[43], email : row.values[117] };
				coll.insertMany([service], function(err,res) {
					console.log(res);
					console.log(service);
				});
			}		
		})
	})
}