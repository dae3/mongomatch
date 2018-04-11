
const express = require('express');
const api = express();
const db = require('./db')
const outputs = require('./outputs');
const dataRouter = require('./api-data');



api.get('/status', (req, res) => {
  res.end('something');
})


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
