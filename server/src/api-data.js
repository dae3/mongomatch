'use strict';
const express = require('express')
const api = express.Router()
const xlsx = require('xlsx');
const multer = require('multer');
const upload = multer();
const db = require('./db');
const debug = require('debug')('temnames:api-data');

api.post('/:number([1-9]{1})',upload.single('file'), (req, res) => {
  var writePromises = [];

	if (isValidRequest(req)) {
		var docArray = jsonFromExcel(req.file, req.body.sheet);
		docArray.forEach((doc) => {
				doc.names = normaliseNames(doc[req.body.namefield]);
				writePromises.push(db.writeDoc(`data${req.params.number}`, doc))
			});
		Promise.all(writePromises).then(() => {
			res.status(200).end(`${writePromises.length} documents written`);
		});

	} else {
		res.status(400).end();
	}

});

function normaliseNames(name) {
	return name
		.replace(',',' ')
		.replace('.',' ')
		.replace('  ', ' ')
		.toLowerCase()
		.split(' ');
}

function jsonFromExcel(excelFile, sheetName) {
		var book = xlsx.read(excelFile.buffer);
		var sheet = book.Sheets[sheetName];
		return xlsx.utils.sheet_to_json(sheet);
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
		sheetValid = Object.keys(xlsx.read(req.file.buffer).Sheets).includes(req.body.sheet);
		if (sheetValid) {
			nfValid = Object.keys(j[0]).includes(req.body.namefield);
		}
	}

	return fieldsValid && fileValid && nfValid && sheetValid;
}

module.exports = api;
