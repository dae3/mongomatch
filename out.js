var mongo = require('mongodb').MongoClient;
const fs = require('fs');


mongo.connect('mongodb://localhost:27017', function (err, client) {
	if (err == null) {
		console.log('db connected');
		var db = client.db('temnames')
		writeEmailOutput(db);
		writeEmpOutput(db);
	} else {
		console.log(`dbconnect: $err`);
	}
});

function transfEmail(doc) {
	return `${doc.name},${doc.emails.email},${doc.emails.score}\r\n`
}

function transfE(doc) {
	return `${doc.name},${doc.employees.number},${doc.employees.companycode},${doc.employees.title},${doc.employees.emptype},${doc.employees.firstname},${doc.employees.lastname},${doc.employees.score}\r\n`
}

function writeEmailOutput(db) {
	var coll = db.collection('emailout');
	var efile = fs.createWriteStream('email.csv');
	efile.on('error',  (e) => {  console.log(e); });
	var dbstream = 	coll.find().stream( { transform : transfEmail });
	dbstream.pipe(efile);
}

function writeEmpOutput(db) {
	var coll = db.collection('employeeout');
	var efile = fs.createWriteStream('employee.csv');
	efile.on('error',  (e) => {  console.log(e); });
	var dbstream = 	coll.find().stream( { transform : transfE });
	dbstream.pipe(efile);
}
