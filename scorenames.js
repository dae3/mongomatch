const lev = require('js-levenshtein')
const mongo = require('mongodb').MongoClient;


function levscore(db) {
	var coll = db.collection('adCrossmatch');
	var cur = coll.find();
	cur.forEach(
		function(service) {
			service.adNames.forEach(
				function(adName) { adName.score = lev(service._id.toLowerCase(), adName.normalisedName); }
			);
			coll.updateOne(
				{ "_id" : service._id },
				{ $set : { "adNames" : service.adNames } }
			).then(
				function(res) { console.log(`AD xm score ${service._id}`) },
				function(err) { console.log('ad update fail' + err) }
			);
		}
	);
	
	var coll2 = db.collection('hcmCrossmatch');
	var cur2 = coll2.find();
	cur2.forEach(
		function(service) {
			if (service != null && service.employeeNames != null) {
				service.employeeNames.forEach(
					function (employeeName) { employeeName.score = lev(service._id.toLowerCase(), employeeName.normalisedName) }
				)					
				coll2.updateOne(
					{ "_id" : service._id },
					{ $set : { "employeeNames" : service.employeeNames} }
				).then(
					function(res) {console.log(`HCM xm score ${service._id}`) }, 
					function(err) { console.log('hcm update fail' + err); })
			}
		}
	);
}


mongo.connect('mongodb://localhost:27017', function (err, client) {
	if (err == null) {
		console.log('db connected');
		var db = client.db('temnames');
		levscore(db);
	} else {
		console.log(`dbconnect: $err`);
	}
	
	// client.close();
});
