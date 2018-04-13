const mongo = require('mongodb').MongoClient;
const readjson = require('readjson');
const debug = require('debug')('temnames:db');
var client;
var db;

var connect =  function(url, dbname) {
  return new Promise((resolve, reject) => {
        mongo.connect(url).then((_client) => {
        client = _client;
        db = client.db(dbname);
        resolve();
      })
      .catch((ex)=>reject(ex))
    });
};

var table = function(name) {
  return db.collection(name).find();
}

var promiseTable = function(name) {
  return new Promise((resolve, reject) => {
    db.collection(name, (err, collection) => {
      if (err) { reject(err) }
      else { resolve(collection); }
    })
  });
};

var createView = function(viewJson) {

}

var wdCollectionName = "";
var wdCollection = null;

var writeDoc = function(collectionName, document) {
  if (wdCollectionName != collectionName ||  wdCollection == null) {
    wdCollection = db.collection(collectionName);
    wdCollectionName = collectionName;
  }

  return wdCollection.insertMany([document]);
}

const deleteCollection = function(collectionName) {
  return db.collection(collectionName).drop();
}

const emptyCollection = function(collectionName) {
    return db.collection(collectionName).deleteMany({});
}

var promisfyReadJson = function(path) {
	return new Promise((resolve, reject) => {
		readjson(path, (err,data)=>{if(!err) {resolve(data)}else{reject(err)}});
	});
}

var promisifyAggregateCollection = function(inCollectionName, pipelineFile) {
  debug(`promisifyAggregateCollection(${inCollectionName},${pipelineFile})`);
	return new Promise((resolve, reject) => {
    var collection;
    try { collection = db.collection(inCollectionName); }
    catch (ex) { debug(`promisifyAggregateCollection ${ex}`); reject(ex); }
		promisfyReadJson(pipelineFile)
    .then((pipeline) => resolve(collection.aggregate(pipeline)))
		.catch((err) => { debug(`promisifyAggregateCollection ${err}`); reject(err) });
	});
}

module.exports = { connect, table, promiseTable, createView, writeDoc, promisfyReadJson, promisifyAggregateCollection, deleteCollection, emptyCollection}
