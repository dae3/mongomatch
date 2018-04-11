const Busboy = require('busboy');
const express = require('express');
const api = express();
const db = require('./db')
const outputs = require('./outputs');
const tempy = require('tempy');
const fs = require('fs');
const xlsx = require('xlsx');

function tokenizeName(name) {
	// eliminate punctuation - well just commas to begin
	name.replace(',',' ');

	// tokenize on space
	return name.split(' ').map(s => s.toLowerCase());
}

const setup = function(req, res, next) {
  res.setHeader('content-type', 'text/xml');
  next();
}

api.use(setup);

api.get('/status', (req, res) => {
  res.end('something');
})

api.get('/employees', (req, res) => {
    let empColl = db.table('employeeout');
    let tx = new outputs.DocToCsvTransformStream({objectMode : true});

    res.setHeader('Content-type', 'text/csv');
    empColl.on('end', () => res.end());
    empColl.pipe(tx).pipe(res);
});

api.get('/users', (req, res) => {
  let users = db.table('emailout');
  let tx = new outputs.DocToCsvTransformStream({objectMode : true});

  res.setHeader('Content-type', 'text/csv');
  users.on('end', () => res.end());
  users.pipe(tx).pipe(res);
});

function dieWithDetails(details) {
  res.statusCode = 400;
  res.end(details);
}

api.delete('/data/:number', (req, res) => {
	var dataNumber = req.params.number;
	if (!/^[1-9]{1}$/.test(dataNumber) || dataNumber < 1 || dataNumber > 9) {
    res.statusCode = 400;
    res.end();
  } else {
  	 	db.deleteCollection(`data${dataNumber}`).then(res.end(`deleted data${dataNumber}`))
  }
});

api.post('/data/:number', (req, res) => {
  var busboy = new Busboy({ headers : req.headers });
	var book;
  var writePromises = [];
  var dataNumber = req.params.number;
  var fieldMap = null;
  var fileType = null;
  var nameField = null;
	var sheetName = null;

  if (!/^[1-9]{1}$/.test(dataNumber) || dataNumber < 1 || dataNumber > 9) {
    res.statusCode = 400;
    res.end();
  }

  busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
    switch (fieldname) {
      case 'map':
        try { fieldMap = JSON.parse(val); } catch (ex) {  }
        break;
      case 'type':
        if (val == 'xlsx' || val == 'csv') { fileType = val }
      break;
      case 'namefield':
          nameField = val;
      break;
			case 'sheet':
				sheetName = val;
      default:
      // do nothing
      break;
    }
  });

	var mapRow = function(row) {
		var r = {};

		fieldMap.forEach((mapEnt) => { r[mapEnt[1]] = row[mapEnt[0]] });
		r.names = r[nameField].replace(',',' ').replace('.',' ').replace('  ',' ').toLowerCase().split(' ');
		return r;
	};


  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		console.log(`receiving file ${filename}`);
    let fn = `${tempy.file()}.xlsx`;
    let f = fs.createWriteStream(fn);

    file.on('end', () => {
				console.log(`file ${fn} received, ${f.bytesWritten}, xlsx processing starting`);
        book = xlsx.readFile(fn);
        fs.unlinkSync(fn);
    });

			file.pipe(f);
  });

  busboy.on('finish', () => {
    if (fieldMap && fileType && nameField && sheetName) {

			if (fileType == 'csv') { res.statusCode = 500; res.end('CSV not implemented yet') }
			else {
				var sheet = book.Sheets[sheetName];
				var docArray = xlsx.utils.sheet_to_json(sheet).map(mapRow);
				console.log(`xlsx processing done, ${docArray.length} rows`);
				docArray.forEach((doc) => writePromises.push(db.writeDoc(`data${dataNumber}`, doc)));

				console.log(`request processing done, async waiting on db commit for ${writePromises.length} documents`)
	      res.statusCode = 200;
				res.write(`writing ${writePromises.length} documents\n`);
	      Promise.all(writePromises).then(() => { res.end(`${writePromises.length} documents written`); console.log('db async wait done'); } );
			}
    } else {
			console.log('param problem in request')
      res.statusCode = 400;
      res.end();
    }
  });

  req.pipe(busboy);
});

db.connect('mongodb://localhost:27017', 'temnames')
.then(api.listen(8080,() => {}))
.catch((ex) => { console.log(ex); process.exit(-1) });
