'user strict';
const proxyquire = require('proxyquire');
const req = require('request');
const stream = require('stream');
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const fs = require('fs');
const through2 = require('through2');

describe('base api', () => {
  const db = {
    connect: sinon.stub().resolves(),
		deleteCollection: sinon.fake.resolves(),
    '@noCallThru': true
  };

	// api require inside before() to prevent it running
	// when suite is .skipped
	var api;
	var URL;
	before(() => {
		process.env.API_PORT = '8800';
		process.env.clientUrl = 'http://client.served.from.here:1234';
		api = proxyquire('../src/api', { './db' : db });
		URL = `http://localhost:${process.env.API_PORT}`;
	});

	const textToObjTransform = through2.obj(function(ch,enc,cb) { 
	// naive implementation requires entire string on 1 line
		this.push(JSON.parse(ch));
		cb();
	});
	const fakePipeline = [ { $lookup: { from: ''} }];


	after(() => { 
		api.close() 
		var f = fs.createWriteStream('../client/temnames/src/app/tickle.ts');
		f.write('// boO');
		f.close();
	});

	it('should start and connect to the database', function(done) {
		expect(db.connect).to.have.been.calledWith('mongodb://db:27017','temnames');
		req.get(`${URL}`, function(err, res, body) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});

  it('should match two collections', function(done) {
		const fakePipeline = [ { $lookup: { from: ''} }];
		const fakeDocsStream = new stream.Readable({objectMode: true});
		[ { a: 'a', b:'b', c:'c'}, { a: 'a', b:'b', c:'c'}, null ].forEach(
			(e) => fakeDocsStream.push(e)
		);

		db.promisfyReadJson = sinon.fake.resolves(fakePipeline);
		db.promisifyAggregateCollection = sinon.fake.resolves(fakeDocsStream);

		req.get(`${URL}/crossmatch/somefrom/someto`, function(err, res, body) {
				expect(res.statusCode).to.equal(200);
				sinon.assert.calledWith(db.promisfyReadJson, './crossmatch.json');
				sinon.assert.calledWith(db.promisifyAggregateCollection, 'somefrom', fakePipeline);
				done();
		});
  });

	it('should score two collections', function(done) {

		const fakeDocsStream = fs.createReadStream('./test/matchsample.json').pipe(textToObjTransform);
		db.promisfyReadJson = sinon.fake.resolves(fakePipeline);
		db.promisifyAggregateCollection = sinon.fake.resolves(fakeDocsStream);

		req.get(`${URL}/scoreCrossmatch/somefrom/someto`, function(err, res, body) {
				expect(res.statusCode).to.equal(200);
				var bodyObj = JSON.parse(body)[0];
				expect(bodyObj).to.have.property('matchedNames');
				bodyObj.matchedNames.map((mn)=>{
								expect(mn).to.have.property('score').a('number')
				});
				done();
		});
	});

	it('should return a collection', function(done) {
		const textToObjTransform = through2.obj(function(ch,enc,cb) {
			// naive implementation requires entire string on 1 line
			this.push(JSON.parse(ch));
			cb();
		});
		const fakeCollection = {
			find: function() {
				return fs
					.createReadStream('./test/matchsample.json')
					.pipe(textToObjTransform);
			}
		};
		db.promiseTable = sinon.fake.resolves(fakeCollection);
		req.get(`${URL}/collection/something`, function(err, res, body) {
			expect(res.statusCode).to.equal(200);
			sinon.assert.calledWith(db.promiseTable,'something');
			done();
		});
	});

	it('should delete a collection', function(done) {
		db.deleteCollection = sinon.fake.resolves();
		req.delete(`${URL}/data/1`, function(err, res, body) {
			sinon.assert.calledWith(db.deleteCollection, 'data1');
			expect(res.statusCode).to.equal(200);
			done();
		});
	});

	it('should list all collections', function(done) {
		db.getAllCollections = sinon.fake.resolves(
			[ { s: { name: 'n1' } }, { s: { name : 'n2' } } ]
		);

		req.get(`${URL}/collections`, function(err, res, body) {
			expect(res.statusCode).to.equal(200);
			sinon.assert.calledOnce(db.getAllCollections);
			done(); // ha
		});
	});

	it('should return CORS headers', function(done) {
		var opts = {
			headers : { Origin: 'http://client.served.from.here:1234' },
			url: `${URL}/collections`
		};
		var callback = (err, res, body) => {
			expect(res.headers['access-control-allow-origin'])
				.to.equal(process.env.clientUrl);
			done();
		};

		req.get(opts, callback);
	});
});
