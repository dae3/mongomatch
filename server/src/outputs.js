function outputs() {}

const { Transform } = require('stream');

class DocToCsvTransformStream extends Transform {

	constructor(options) {
		super(options)
		this.firstLine = true;
	}

	_transform(chunk, encoding, callback) {
		var d;

		if (this.firstLine) {
			d = Object.keys(chunk)
			this.firstLine = false
		} else {
			d = Object.values(chunk)
		}

		callback(null, d.reduce((a,v) => a + ',' + v) + '\n');
	}

	_flush(callback) { 	}
}

module.exports = { outputs, DocToCsvTransformStream };
