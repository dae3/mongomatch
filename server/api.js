const fs = require('fs');
const api = require('express')();
const db = require('./db')
const outputs = require('./outputs');
const dataRouter = require('./api-data');
const debug = require('debug')('temnames:api');
const transforms = require('./transforms');
const through2 = require('through2');
const lev = require('js-levenshtein');

api.get('/status', (req, res) => {
  res.end('something');
});

function getCrossmatch(fromCollection, toCollection) {
  return db.promisfyReadJson('./crossmatch.json')
  .then((pipeline) => {
     pipeline[0].$lookup.from = toCollection;
     return db.promisifyAggregateCollection(fromCollection, pipeline)
   })
}

api.get('/crossmatch/:from/:to', (req, res) => {
  getCrossmatch(req.params.from, req.params.to)
  .then((cursor) => cursor.pipe(transforms.documentToCsv()).pipe(res))
  .catch((e) => {
    res.statusCode = 500
    res.end(e.toString());
  });
});

api.get('/scoreCrossmatch/:from/:to', (req, res) => {

  const scoreTransform = through2.obj(function(ch,enc,cb) {
    let basename = ch.names.reduce((a,v) => a += ` ${v}`).toLowerCase();
    ch.matchedNames.map((v) => { v.score = lev(basename, v.name.toLowerCase()) });
    this.push(ch);
    cb();
  });

  getCrossmatch(req.params.from, req.params.to)
  .then(
    (cursor) => cursor.pipe(scoreTransform)
    .pipe(transforms.documentToCsv()).pipe(res)
  )
  .catch((err) => {
    res.statusCode = 500;
    res.end(err.toString());
  })

});

api.get('/collectionAsCSV/:name', (req, res) => {
  db.promiseTable(req.params.name)
  .then((table) => table.find().pipe(transforms.documentToCsv()).pipe(res))
  .catch((e) => { res.statusCode = 500; res.end(e); });
});

api.delete('/data/:number([1-9]{1})', (req, res) => {
	 	db.deleteCollection(`data${req.params.number}`)
		.then(res.end(`deleted data${req.params.number}`))
		.catch((e) => {
			res.statusCode = 500;
			res.end(e);
		});
});

// POST router for /data
api.use('/data', dataRouter);

db.connect('mongodb://db:27017', 'temnames')
.then(api.listen(80,() => {}))
.catch((ex) => { console.log(ex); process.exit(-1) });
