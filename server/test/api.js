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
		process.env.API_HOST = 'host';
		process.env.CLIENT_URL = 'http://client.served.from.here:1234';
		api = proxyquire('../src/api', { './db' : db });
		URL = `http://localhost:${process.env.API_PORT}`;
	});

	const textToObjTransform = function() { return through2.obj(function(ch,enc,cb) { 
		// naive implementation requires entire string on 1 line
			this.push(JSON.parse(ch));
			cb();
		});
	};

	after(() => { api.close() });

	it('should start and connect to the database', function(done) {
		expect(db.connect).to.have.been.calledWith(
			`mongodb://${process.env.API_HOST}:27017`,'temnames'
		);
		req.get(`${URL}`, function(err, res, body) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});

  it('should match two collections', function(done) {
		const fakePipeline = [ { $lookup: { from: 'data2'} }];
		const fakeDocsStream = new stream.Readable({objectMode: true});
		[ { a: 'a', b:'b', c:'c'}, { a: 'a', b:'b', c:'c'}, null ].forEach(
			(e) => fakeDocsStream.push(e)
		);

		db.promisfyReadJson = sinon.fake.resolves(fakePipeline);
		db.promisifyAggregateCollection = sinon.fake.resolves(fakeDocsStream);

		req.get(`${URL}/crossmatch/1/2`, function(err, res, body) {
				expect(res.statusCode).to.equal(200);
				expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
				sinon.assert.calledWith(db.promisfyReadJson, './crossmatch.json');
				sinon.assert.calledWith(db.promisifyAggregateCollection, 'data1', fakePipeline);
				done();
		});
  });

	it('should score two collections', function(done) {
		testScoreCrossmatch('1','2',done);
	});

	it('should score two collections by name', function(done) {
		testScoreCrossmatch('data1','data2',done);
	});

	testScoreCrossmatch = (col1, col2, done) => {

		const fakeDocsStream = fs.createReadStream('./test/matchsample.json').pipe(textToObjTransform());
		db.promisfyReadJson = sinon.fake.resolves( [ { $lookup: { from: ''} } ] );
		db.promisifyAggregateCollection = sinon.fake.resolves(fakeDocsStream);

		req.get(`${URL}/scoreCrossmatch/${col1}/${col2}`, function(err, res, body) {
				expect(res.statusCode).to.equal(200);
				expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
				expect(db.promisfyReadJson).to.have.been.calledWith( './crossmatch.json');
				expect(db.promisifyAggregateCollection).to.have.been.calledWith(
					'data1', [ { $lookup: { from: 'data2'} } ]
				);
				var bodyObj = JSON.parse(body)[0];
				expect(bodyObj).to.have.property('matchedNames');
				bodyObj.matchedNames.map((mn)=>{
								expect(mn).to.have.property('score').a('number')
				});
				done();
		});
	};


	const fakeCollection = {
		find: function() {
			return fs
				.createReadStream('./test/matchsample.json')
				.pipe(textToObjTransform());
		}
	};

	const expectedCollection = JSON.parse('['+fs.readFileSync('./test/matchsample.json')+']');


	it('should return a collection', function(done) {
		db.promiseTable = sinon.fake.resolves(fakeCollection);
		req.get(`${URL}/collection/5`, function(err, res, body) {
			expect(res.statusCode).to.equal(200);
			expect(db.promiseTable).to.be.calledWith('data5');
			expect(JSON.parse(body)).to.deep.equal(expectedCollection);
			done();
		});
	});

	it('should return a named collection', function(done) {
		db.promiseTable = sinon.fake.resolves(fakeCollection);
		req.get(`${URL}/collection/name`, function(err, res, body) {
			expect(res.statusCode).to.equal(200);
			expect(db.promiseTable).to.be.calledWith('name');
			done();
		});
	});

	it('should delete a numbered collection', function(done) {
		db.deleteCollection = sinon.fake.resolves();
		req.delete(`${URL}/collection/1`, function(err, res, body) {
			expect(res.statusCode).to.equal(200);
			expect(db.deleteCollection).to.be.calledWith('data1');
			done();
		});
	});

	it('should delete a named collection', function(done) {
		db.deleteCollection = sinon.fake.resolves();
		req.delete(`${URL}/collection/deleteMe`, function(err, res, body) {
			expect(res.statusCode).to.equal(200);
			expect(db.deleteCollection).to.be.calledWith('deleteMe');
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
				.to.equal(process.env.CLIENT_URL);
			done();
		};

		req.get(opts, callback);
	});
});
