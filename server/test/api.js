'user strict';
const proxyquire = require('proxyquire');
const req = require('request');
const stream = require('stream');
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

describe('base api', () => {
  const db = {
    connect: function(url, dbname) {
      return Promise.resolve();
    },
	deleteCollection: () => {},
    '@noCallThru': true
  };

  process.env.API_PORT = '8800';
  const api = proxyquire('../src/api', {
    './db' : db
  });

  const URL = `http://localhost:${process.env.API_PORT}`;

  beforeEach(() => {

  });


  it('is just a test', function() {
    expect(true).to.be.true;
  });

  it('should return status', function(done) {
    req.get(`${URL}/status`, function(err, res, body) {
		expect(res.statusCode).to.equal(200);
		expect(body).to.equal(JSON.stringify({status:'something'}));
		done();
    });
  });

  it('should delete a collection', function(done) {
	db.deleteCollection = sinon.fake.resolves({});
	
    req.delete(`${URL}/collection/some-collection`, function(err, res, body) {
		expect(db.deleteCollection.calledWith('some-collection')).to.be.true;
		expect(res.statusCode).to.equal(200);
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
				fakePipeline[0].$lookup.from = 'nothis';
				sinon.assert.calledWith(db.promisifyAggregateCollection, 'somefrom', fakePipeline);
				done();
		});
  })

});
