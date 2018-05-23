'use strict';
const express = require('express')
const api = express.Router()
const multer = require('multer');
const upload = multer({ dest: 'xl/' });
const db = require('./db');
const debug = require('debug')('temnames:api-data');
const Worker = require('tiny-worker');

api.post('/:number([1-9]{1})',upload.single('file'), (req, res) => {
	uploadCollection(req, res, `data${req.params.number}`); 
});

api.post('/:name', upload.single('file'), (req, res) => {
	uploadCollection(req, res, req.params.name);
});

function uploadCollection(req, res, collectionName) {
	var worker = new Worker('./src/xlworker.js');

	worker.onmessage = function(event) {
		if (!event.data.ok) {
			res.status(400).end();
		} else {
			writeCollection(collectionName, event.data.sheetData, req.body.namefield)
				.then(() => res.status(200).end())
				.catch((e) => res.status(500).end(e.toString()))
		}
		res.status(200).end();
		worker.terminate();
	};

	worker.onerror = function(err) {
		worker.terminate();
		res.status(500).end(err.message);
	}

	// passing a Buffer seems to be broken
	// perhaps https://github.com/avoidwork/tiny-worker/issues/18
	// shared file is ugly but workable
	// multer has committed the file to disk by the time we get here

	if (req.file == undefined) {
		res.status(400).end()
	} else {
		worker.postMessage({
			filename: `xl/${req.file.filename}`,
			sheetname: req.body.sheet,
			namefield: req.body.namefield
		});
	}
}

function writeCollection(name, data, namefield) {
	data.forEach((d) => {
		d.names = normaliseNames(d[namefield]);
		d.name = d[namefield];
	});
	return db.writeDocs(name, data);
}

// TODO async?? it's probably O(3N) and called lots
function normaliseNames(name) {
	return name
		.replace(',',' ')
		.replace('.',' ')
		.replace('  ', ' ')
		.toLowerCase()
		.split(' ');
}

module.exports = api;
