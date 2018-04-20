const through2 = require('through2');

const documentToCsv = () => {
  var firstLine = true;
  var rc = 0;
  return through2.obj(function(chunk, enc, callback) {
    if (firstLine) {
      this.push(Object.keys(chunk).reduce((a,v) => a + ',' + v) + '\n');
      firstLine = false;
    } else {
      this.push(
        Object.values(chunk)
        .reduce((a,v) => a + ',' + ((typeof v == 'object') ? JSON.stringify(v) : v))
         + '\n'
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

module.exports =  { documentToCsv, documentToJSON }
