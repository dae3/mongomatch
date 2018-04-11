const mongo = require('mongodb').MongoClient;
const readjson = require('readjson');
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

var promisifyAggregateCollection = function(inCollectionName, outCollectionName, pipelineFile) {
	// https://stackoverflow.com/questions/48666648/out-stage-of-mongo-aggregation-pipeline-not-taking-effect-using-node
	//  need the toArray call on the Cursor returned from aggregate() to allow the $out stage of the pipeline to take effect
	return new Promise((resolve, reject) => {
		var collection = db.collection(inCollectionName);
		promisfyReadJson(pipelineFile)
		.then((pipeline) => collection.aggregate(pipeline).out(outCollectionName).toArray())
		.then(() => resolve(db))
		.catch((err) => reject(err));
	});
}

module.exports = { connect, table, writeDoc, promisifyAggregateCollection, deleteCollection, emptyCollection}
