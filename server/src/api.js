const fs = require('fs');
const api = require('express')();
const db = require('./db');
const outputs = require('./outputs');
const dataRouter = require('./api-data');
const debug = require('debug')('temnames:api');
const transforms = require('./transforms');
const through2 = require('through2');
const lev = require('js-levenshtein');
const corser = require('corser');
var server;

// require('blocked-at')((time, stack) => {
//   console.log(`Blocked for ${time}ms, operation started here:`, stack)
// });

api.use(corser.create(
	{
		origins: [ process.env.CLIENT_URL ? process.env.CLIENT_URL : '*' ],
		methods: ['GET','POST','DELETE']
	}
)); 

api.delete('/collection/:number([1-9]{1})', (req, res) => {
  deleteCollection(res, `data${req.params.number}`);
});

api.delete('/collection/:name', (req, res) => {
  deleteCollection(res, req.params.name);
});

function deleteCollection(res, collectionName) {
	db.deleteCollection(collectionName)
  .then((dropRes) => { res.status(200).end(); })
  .catch((err) => { res.status(404).end(err.toString()); })
  .then(() => debug(`DELETE /${req.params.name} => ${res.statusCode}`))
}

function getCrossmatch(fromCollection, toCollection) {
  return db.promisfyReadJson('./crossmatch.json')
  .then((pipeline) => {
     pipeline[0].$lookup.from = toCollection;
     return db.promisifyAggregateCollection(fromCollection, pipeline)
   })
}

api.get('/crossmatch/:from([1-9]{1})/:to([1-9]{1})', (req, res) => {
  debug(`/crossmatch ${req.params.from},${req.params.to}`);
  getCrossmatch(`data${req.params.from}`,`data${req.params.to}`)
  .then((cursor) => {
		res.set('content-type','application/json');
		cursor.pipe(transforms.documentToJSON()).pipe(res);
	})
  .catch((e) => {
    res.statusCode = 500
    res.end(e.toString());
  });
});

api.get('/scoreCrossmatch/:from([1-9]{1})/:to([1-9]{1})', (req, res) => {
  debug(`/scoreCrossmatch ${req.params.from},${req.params.to}`);
	scoreCrossmatch(`${req.params.from}`, `${req.params.to}`, res, req.query.format, req.query.unroll, req.query.filename);
});

api.get('/scoreCrossmatch/:from/:to', (req, res) => {
  debug(`/scoreCrossmatch ${req.params.from},${req.params.to}`);
	scoreCrossmatch(`${req.params.from}`, `${req.params.to}`, res, req.query.format, req.query.unroll, req.query.filename);
});


function scoreCrossmatch(col1, col2, res, fmt, unrollField, filename) {
	debug(`${col1}, ${col2}, ${res}, ${fmt}, ${unrollField}`);
  const scoreTransform = through2.obj(function(ch,enc,cb) {
		if (ch.hasOwnProperty('names') && ch.hasOwnProperty('matchedNames')) {
			let basename = ch.names.reduce((a,v) => a += ` ${v}`).toLowerCase();
			ch.matchedNames.map((v) => { v.score = lev(basename, v.name.toLowerCase()) });
		}
    this.push(ch);
    cb();
  });

	const mimeType = fmt === 'csv' ? 'text/csv' : 'application/json';
	var finalTransform;
	if (fmt === 'csv' && unrollField != null)
		finalTransform = transforms.documentToMultiCsv(unrollField);
	else if (fmt === 'csv')
		finalTransform = transforms.documentToCsv();
	else
		finalTransform = transforms.documentToJSON();

  getCrossmatch(col1, col2)
  .then( (cursor) => {
		filename && res.append('Content-Disposition','attachment; filename="' + filename + '"');
		res.type(mimeType);
		cursor.pipe(scoreTransform).pipe(finalTransform).pipe(res)
	})
  .catch((err) => { res.status(500).end(err.toString()) })

}

api.get('/collection/:number([1-9]{1})', (req, res) => {
	getCollection(`data${req.params.number}`, res);
});

api.get('/collection/:name', (req, res) => {
	getCollection(req.params.name, res);
});

function getCollection(name, res) {
  db.promiseTable(name)
  .then((table) => table.find().pipe(transforms.documentToJSON()).pipe(res))
  .catch((e) => { res.statusCode = 500; res.end(e); });
}


api.get('/collections', (req, res) => {
  db.getAllCollections()
  .then((r) => { res.end(JSON.stringify(r.map((e) => e.s.name))) })
  .catch((e) => {
    res.statusCode = 500;
    res.end(e.toString());
  })
})

exports.close = function() { server.close() };

// POST router for /data
api.use('/collection', dataRouter);


var dbHost = process.env.API_HOST || 'localhost';
var apiPort = process.env.API_PORT || 8081;
db.connect(`mongodb://${dbHost}:27017`, 'temnames')
.then(server = api.listen(apiPort,() => {}))
.catch((ex) => { console.log(ex); process.exit(-2) });
