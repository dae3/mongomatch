'use strict';
const express = require('express')
const api = express.Router()
const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer();
const db = require('./db');
const debug = require('debug')('temnames:api-data');

api.post('/:number([1-9]{1})',upload.single('file'), (req, res) => {
	if (!isValidRequest(req)) {
		res.status(400).end();
	} else {
		writeCollection(
			`data${req.params.number}`,
			jsonFromExcel(req.file, req.body.sheet),
			req.body.namefield
		)
		.then(() => res.status(200).end())
		.catch((e) => res.status(500).end(e.toString()))
	}
});

api.post('/:name', upload.single('file'), (req, res) => {
	if (!isValidRequest(req)) {
		res.status(400).end();
	} else {
		writeCollection(
			req.params.name,
			jsonFromExcel(req.file, req.body.sheet),
			req.body.namefield
		)
		.then(() => res.status(200).end())
		.catch((e) => res.status(500).end(e.toString()))
	}
});

function guidForCollection(name) {
	db.writeDoc('index', { name: name })
	.then((result) => { return result.ops[0]._id })
	.catch((err) =>{ throw(new Error(err.toString()))})
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

// TODO make this async
var book, sheet, xl;
function jsonFromExcel(excelFile, sheetName) {
		if (book == null || sheet == null || xl == null) {
			book = xlsx.read(excelFile.buffer);
			sheet = book.Sheets[sheetName];
			xl = xlsx.utils.sheet_to_json(sheet);
		}
	return xl;
}

function isValidRequest(req) {
	var fieldsValid = 
		(typeof req.body.namefield === 'string') && 
		(typeof req.body.sheet === 'string');

	var fileValid = (typeof req.file === 'object');

	var nfValid = false;
	var sheetValid = false;
	if (fileValid && fieldsValid) {
		var j = jsonFromExcel(req.file, req.body.sheet);
		sheetValid = Object.keys(book.Sheets).includes(req.body.sheet);
		if (sheetValid) {
			nfValid = Object.keys(j[0]).includes(req.body.namefield);
		}
	}

	return fieldsValid && fileValid && nfValid && sheetValid;
}

module.exports = api;
