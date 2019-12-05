const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');


const URL = "mongodb://localhost:27017/tienda";
const dbName = 'tienda';

var dbobj = {};

dbobj.db = null;

dbobj.initPool = async () => {
  try {
    // Use connect method to connect to the Server
    client = await MongoClient.connect(URL, {useUnifiedTopology: true,  useNewUrlParser: true });
    dbobj.db = client.db(dbName);
  } catch (err) {
    console.log(err.stack);
  }
}

dbobj.getInstance = () => {
  if (!dbobj.db) {
    this.initPool();
  }

  return dbobj.db;
}

dbobj.getId = (id) => {
  return new mongodb.ObjectID(id);
}

dbobj.BsonRegExp = (expresion) => {
  return new mongodb.BSONRegExp(expresion, "i")
  // return  new mongodb.BSONRegExp("\\^\\.\\*VINI\\.\\*\\$", "i");
}

module.exports = dbobj;