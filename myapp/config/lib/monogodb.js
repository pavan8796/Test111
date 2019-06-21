var mongodb = require('mongodb');
var config = require("../config.json");

var clientLocal = "";
module.exports.init = function (callback) {
  mongodb.MongoClient.connect("mongodb://@" +
    config.mongodb.localHost + ":" + config.mongodb.localPort + "/" +
    config.mongodb.localDatabase, { useNewUrlParser: true }, function (err, client) {
      if (client) {
        clientLocal = client.db(config.mongodb.localDatabase);
        registerListenerEvents(callback);
      } else {
        if (typeof callback === 'function') {
          callback(false, {});
        }
        setTimeout(module.exports.init, 5000);
      }
    });
}

module.exports.getDBConnection = function () {
  return clientLocal;
}
var registerListenerEvents = function (callback) {
  clientLocal.on('close', function () {
    console.log('Client Lost Connection');
  });
  clientLocal.on('reconnect', function () {
    console.log('Client Reconnected Successfully');
  });
  if (typeof callback === 'function') {
    callback(false, {});
  }

}

module.exports.createOne = function (db, collection, record, callback) {
  db.collection(collection).insertOne(record, function (err, data) {
    callback(err, data);
  });
}

//[{a : 1}, {a : 2}, {a : 3}]
module.exports.createMany = function (db, collection, records, callback) {
  db.collection(collection).insertMany(records, function (err, data) {
    callback(err, data);
  });
}

module.exports.deleteOne = function (db, collection, record, callback) {
  db.collection(collection).deleteOne(record, function (err, data) {
    callback(err, data);
  });
}

module.exports.deleteMany = function (db, collection, record, callback) {
  db.collection(collection).remove(record, function (err, data) {
    callback(err, data);
  });
}
//findCol:- {_id:ObjectID(12fdksfklsdklf9i0)},setCol:-{name:"pavan"}
module.exports.update = function (db, collection, findCol, setCol, callback) {
  db.collection(collection).update(findCol, { $set: setCol }, function (err, result) {
    callback(err, result);
  });
}

module.exports.updateOne = function (db, collection, findCol, setCol, callback) {
  db.collection(collection).updateOne(findCol, { $set: setCol }, function (err, result) {
    callback(err, result);
  });
}


//findCol:- { userID: "123456" }
module.exports.getOne = function (db, collection, findCol, callback) {
  db.collection(collection).findOne(findCol, function (err, result) {
    callback(err, result);
  });
}

//findCol:- { userID: "123456" }
module.exports.getAll = function (db, collection, findCol, callback) {
  var result = [];
  var stream = db.collection(collection).find(findCol).stream();
  stream.on('data', function (doc) {
    result.push(doc);
  });
  stream.on('error', function (err) {
    callback(err, result);
  });
  stream.on('end', function () {
    callback(false, result);
  });
}