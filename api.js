const fs = require('fs');
const api = require('express')();
const db = require('./db')
const outputs = require('./outputs');
const dataRouter = require('./api-data');
const through2 = require('through2');
const debug = require('debug')('temnames:api');

api.get('/status', (req, res) => {
  res.end('something');
});

api.get('/collectionAsCSV/:name', (req, res) => {

  const d2c = () => {
    var firstLine = true;
    var rc = 0;
    return through2.obj(function(chunk, enc, callback) {
        if (firstLine) {
          this.push(Object.keys(chunk).reduce((a,v) => a + ',' + v) + '\n');
          firstLine = false;
        } else {
          this.push(Object.values(chunk).reduce((a,v) => a + ',' + v) + '\n');
        }
        callback();
    });
  };


  db.promisifyAggregateCollection(req.params.name, './generic-crossmatch.json')
  .then((cursor) => cursor.pipe(d2c()).pipe(res))
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

db.connect('mongodb://localhost:27017', 'temnames')
.then(api.listen(8080,() => {}))
.catch((ex) => { console.log(ex); process.exit(-1) });
