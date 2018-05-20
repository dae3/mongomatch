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

  return wdCollection.insert(document);
};

var writeDocs = function(collectionName, documents) {
	return db.collection(collectionName).bulkWrite(
		documents.map((doc) => { return { insertOne : { document : doc } } })
	);
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

var promisifyAggregateCollection = function(inCollectionName, pipeline) {
  debug(`promisifyAggregateCollection(${inCollectionName},${JSON.stringify(pipeline)})`);
	return new Promise((resolve, reject) => {
    var collection;
    try { collection = db.collection(inCollectionName); }
    catch (ex) { debug(`promisifyAggregateCollection ${ex}`); reject(ex); }
    resolve(collection.aggregate(pipeline))
	});
}

const getAllCollections = () => db.collections();

module.exports = { connect, table, getAllCollections, promiseTable, createView, writeDoc, promisfyReadJson, promisifyAggregateCollection, deleteCollection, emptyCollection, writeDocs }
