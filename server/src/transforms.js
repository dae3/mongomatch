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
	var firstLine = true;
	return through2.obj(function(chunk, enc, callback) {
		if (firstLine) { this.push('['); firstLine = false; }
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

		if (unrollField === undefined) {
			out = [chunk];
		} else {
			out = chunk[unrollField].map( u => {
				var cleanchunk = Object.assign({}, chunk);
				delete cleanchunk[unrollField];
				Object.keys(u).map( k => cleanchunk[unrollField+'-'+k] = u[k] );
				return cleanchunk;
			});
		}
		debug(out);

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
