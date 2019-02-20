'option strict';
const through2 = require('through2');
const debug = require('debug')('temnames:transforms');

const documentToCsv = (unrollField) => {
	var firstline = true;
	return through2.obj(function(chunk, enc, callback) {
		var out;
		if (unrollField === undefined) {
			out = [chunk];
		} else {
			out = chunk[unrollField].map( u => Object.assign(Object.assign({},chunk), u) );
		}

		if (firstline) {
			this.push(
				Object.keys(out[0])
				.filter( k => typeof out[0][k] !== 'object')
				.join(',') + '\n'
			);
			firstline = false;
		} else {
			out.forEach( u =>
				this.push(
					"\"" + 
					Object.values(u)
					.filter( v => typeof v !== 'object')
					.join("\",\"")
					.replace(/[\r\n]/g,'')
					+ "\"\n"
				)
			);
		}
		callback();
	})
};

const documentToJSON = () => {
	var firstline = true;
	return through2.obj(function(chunk, enc, callback) {
		if (firstline) { this.push('['); firstline = false; }
		else { this.push(',') }
		this.push(JSON.stringify(chunk));
		callback();
	},
		function(cb) { this.push(']'); cb(); }
	)
};

const documentToMultiCsv = (unrollField) => {
	var firstline = true;

	return through2.obj(function(chunk, enc, callback) {
		var out;
		var cleanchunk;

		if (unrollField === undefined) {
			out = [chunk];
		} else {
			cleanchunk = Object.assign({}, chunk);
			delete cleanchunk[unrollField];
			//			chunk[unrollField].map( u => debug(u));
			out = chunk[unrollField].map( u => Object.assign(cleanchunk, u) );
			debug(out);
			//out = [chunk];
		}

		if (firstline) {
			this.push(
				Object.keys(out[0])
				.filter( k => typeof out[0][k] !== 'object')
				.join(',') + '\n'
			);
			firstline = false;
		} else {
			out.forEach( u =>
				this.push(
					"\"" + 
					Object.values(u)
					.filter( v => typeof v !== 'object')
					.join("\",\"")
					.replace(/[\r\n]/g,'')
					+ "\"\n"
				)
			);
		}
		callback();
	})
};

module.exports =  { documentToCsv, documentToJSON, documentToMultiCsv }
