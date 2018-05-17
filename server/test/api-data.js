'use strict';
const proxyquire = require('proxyquire');
const req = require('request');
const stream = require('stream');
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const fs = require('fs');

describe('upload api', () => {

	process.env.API_PORT = '8801';
	const URL = `http://localhost:${process.env.API_PORT}`;
	var api;

	var fakeUpload;
	var db = {
			connect: sinon.stub().resolves(),
			writeDoc: sinon.stub().resolves(),
			'@noCallThru': true,
			'@global': true
	};

	after(() => { api.close() });

	beforeEach(function() {
		fakeUpload = {
			namefield: 'Name',
			sheet: 'Data 1',
			file: fs.createReadStream('./test/testupload.xlsx')
		};
		db.writeDoc.reset();
	});

	// api require inside before() to prevent it running
	// when suite is .skipped
	before(() => {
		api = proxyquire('../src/api', { './db' : db });
	});
	
	const reqPostFake = function(statusExpectation, callback) {
		req.post(
			{url: `${URL}/collection/1`, formData: fakeUpload},
			function(err, res, body) {
				expect(res.statusCode).to.equal(statusExpectation);
				callback();
			}
		);
	};

	it('should return status 400 if the sheet is invalid', function(done) {
		fakeUpload.sheet = 'notAValidSheet';
		reqPostFake(400, done);
	});

	it('should return status 400 if the namefield is invalid', function(done) {
		fakeUpload.namefield = 'notAValidField';
		reqPostFake(400, done);
	});

	it('should return status 400 if the namefield is missing', function(done) {
		delete fakeUpload.namefield;
		reqPostFake(400, done);
	});

	it('should return status 400 if the sheet is missing', function(done) {
		delete fakeUpload.sheet;
		reqPostFake(400, done);
	});

	it('should return status 400 if the file is missing', function(done) {
		delete fakeUpload.file
		reqPostFake(400, done);
	});

	it('should upload a file to a named collection', function(done) {

  	req.post(
			{ url: `${URL}/collection/namedCollection`, formData: fakeUpload },
			function(err, res, body) {
				expect(err).to.be.null;
				expect(res.statusCode).to.equal(200);
				expect(db.writeDoc.callCount).to.equal(2);
				expect(db.writeDoc.firstCall).to.be.calledWith(
					'namedCollection',
					{ Code: "0401001001",
						Name: "John Smith",
						name: "John Smith",
						Parent: "IPHONE",
						Status: "ACTIVE",
						Type: "IPHONE",
						Anotherfield: "AnotherValue",
						names: ['john','smith']
					});
				expect(db.writeDoc.secondCall).to.be.calledWith(
					'namedCollection',
					{ Code: "0401002002",
						Name: "Fred Bloggs",
						name: "Fred Bloggs",
						Parent: "IPHONE",
						Status: "ACTIVE",
						Type: "IPHONE",
						Anotherfield: "AnotherValue",
						names: ['fred','bloggs']
					});

				done();
			}
		);
	});

	it('should upload a file to a numbered collection', function(done) {
		req.post(
			{url: `${URL}/collection/1`, formData: fakeUpload},
			function(err, res, body) {
				expect(err).to.be.null;
				expect(res.statusCode).to.equal(200);
				expect(db.writeDoc.callCount).to.equal(2);
				expect(db.writeDoc.firstCall).to.be.calledWith(
					'data1',
					{ Code: "0401001001",
						Name: "John Smith",
						name: "John Smith",
						Parent: "IPHONE",
						Status: "ACTIVE",
						Type: "IPHONE",
						Anotherfield: "AnotherValue",
						names: ['john','smith']
					});
				expect(db.writeDoc.secondCall).to.be.calledWith(
					'data1',
					{ Code: "0401002002",
						Name: "Fred Bloggs",
						name: "Fred Bloggs",
						Parent: "IPHONE",
						Status: "ACTIVE",
						Type: "IPHONE",
						Anotherfield: "AnotherValue",
						names: ['fred','bloggs']
					});
				done();
			});
		});

});
