'use strict';
const xlsx = require('xlsx');
const debug = require('debug')('temnames:xlworker');
const fs = require('fs');

onmessage = function(event) {
	var book, sheet, data;
	var isOK = false;

	debug(event);

	if (fieldsValid(event.data)) {
		book = xlsx.readFile(event.data.filename);
		if (sheetValid(book, event.data.sheetname)) {
			sheet = book.Sheets[event.data.sheetname];
			if (namefieldValid(book, sheet, event.data.namefield))
			{
				debug('data validated');
				isOK = true;
				data = xlsx.utils.sheet_to_json(sheet);
			}
		}
	}
	debug('data ' + data[0]);
	debug(data[0]);
	fs.unlink(event.data.filename, () => {});
	postMessage({ ok: isOK, sheetData: data });
};

function fieldsValid(edata) {
	return edata.sheetname != undefined &&
		edata.namefield != undefined &&
		edata.filename != undefined
}

function sheetValid(book, sheetname) {
	return Object.keys(book.Sheets).includes(sheetname);
}

function namefieldValid(book, sheet, namefield) {
	var sheetdata = xlsx.utils.sheet_to_json(sheet);
	return Object.keys(sheetdata[0]).includes(namefield);
}


