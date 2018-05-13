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

api.use(corser.create(
	{
		origins: [ process.env.clientUrl ? process.env.clientUrl : '*' ],
		methods: ['GET','POST','DELETE']
	}
)); 

api.delete('/collection/:name', (req, res) => {
  debug(`DELETE /${req.params.name}`); //
  db.deleteCollection(req.params.name)
  .then((dropRes) => { res.statausCode = 200; res.end(); })
  .catch((err) => {
    res.statusCode = 404;
    res.end(err.toString());
  })
  .then(() => debug(`DELETE /${req.params.name} => ${res.statusCode}`))
});

function getCrossmatch(fromCollection, toCollection) {
  return db.promisfyReadJson('./crossmatch.json')
  .then((pipeline) => {
     pipeline[0].$lookup.from = toCollection;
     return db.promisifyAggregateCollection(fromCollection, pipeline)
   })
}

api.get('/crossmatch/:from/:to', (req, res) => {
  debug(`/crossmatch ${req.params.from},${req.params.to}`);
  getCrossmatch(req.params.from, req.params.to)
  .then((cursor) => cursor.pipe(transforms.documentToJSON()).pipe(res))
  .catch((e) => {
    res.statusCode = 500
    res.end(e.toString());
  });
});

api.get('/scoreCrossmatch/:from/:to', (req, res) => {
  debug(`/scoreCrossmatch ${req.params.from},${req.params.to}`);
  const scoreTransform = through2.obj(function(ch,enc,cb) {
    let basename = ch.names.reduce((a,v) => a += ` ${v}`).toLowerCase();
    ch.matchedNames.map((v) => { v.score = lev(basename, v.name.toLowerCase()) });
    this.push(ch);
    cb();
  });

  getCrossmatch(req.params.from, req.params.to)
  .then(
    (cursor) => {
      cursor
        .on('end', () => debug('/scoreCrossmatch cursor end'))
        .pipe(scoreTransform)
        .pipe(transforms.documentToJSON())
        .pipe(res);
      debug('/scoreCrossmatch db return');
    }
  )
  .catch((err) => {
    res.statusCode = 500;
    res.end(err.toString());
  })

});

api.get('/collection/:name', (req, res) => {
  db.promiseTable(req.params.name)
  .then((table) => table.find().pipe(transforms.documentToJSON()).pipe(res))
  .catch((e) => { res.statusCode = 500; res.end(e); });
});

api.delete('/data/:number([1-9]{1})', (req, res) => {
	 	db.deleteCollection(`data${req.params.number}`)
		.then(res.end(`deleted data${req.params.number}`))
		.catch((e) => {
			res.statusCode = 500;
			res.end(e.toString());
		});
});


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
api.use('/data', dataRouter);


db.connect('mongodb://db:27017', 'temnames')
.then(server = api.listen(process.env.API_PORT,() => {}))
.catch((ex) => { console.log(ex); process.exit(-1) });
