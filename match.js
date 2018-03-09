const rosette = require('rosette-api');
const api = new Api('1ffa8a09c222bd27a109fae05f0d70b9');

var mongo = require('mongodb').MongoClient;

mongo.connect('mongodb://localhost:27017', function (err, client) {
	if (err == null) {
		console.log('db connected');
		var db = client.db('bam')
		tokenizeInventoryNames(db);
		// csvToDb(db);
	} else {
		console.log(`dbconnect: $err`);
	}
	
	// client.close();
});

function tokenizeInventoryNames(db) {
	var inventory = db.collection('inventory');
	inventory.updateMany( { email : '' }, { $set : { names :
}

