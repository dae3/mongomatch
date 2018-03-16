var mongo = require('mongodb').MongoClient;
const fs = require('fs');
const { Transform } = require('stream');

mongo.connect('mongodb://localhost:27017')
.then((client) => client.db('temnames'))
.then((db) => {
		return Promise.all([
			collectionToCsv(db.collection('emailout'), 'email.csv'),
			collectionToCsv(db.collection('employeeout'), 'employee.csv')
		])
})
.then(() => { console.log('done'); process.exit(0) })
.catch((err) => { console.log(err); process.exit(-1) })

// function docToCsvRow(doc) { return Object.values(doc).reduce((a,v) => a + ',' + v) + "\n" }
	
function collectionToCsv(collection, csvpath) {
	return new Promise((resolve, reject) => {
		
		var csvStream = new DocToCsvTransformStream({ objectMode : true });
		
		try {
			var out = fs.createWriteStream(csvpath);
			var cur = collection.find();
			cur.pipe(csvStream).pipe(out);
			cur.on('end', resolve);
		} catch (err) { reject(err) }
	});	
}

// really naive implementation of a Transform stream
//  needs argument sanity checking and error handling
class DocToCsvTransformStream extends Transform {

	constructor(options) {
		super(options)
		this.firstLine = true;
	}
	
	_transform(chunk, encoding, callback) {
		var data = "";
		
		if (this.firstLine) {
			data = Object.keys(chunk).reduce((a,v) => a + ',' + v) + '\n'
			this.firstLine = false
		}
		
		data += Object.values(chunk).reduce((a,v) => a + ',' + v) + '\n'
		
		callback(null, data);
	}
	
	_flush(callback) { 	}
}