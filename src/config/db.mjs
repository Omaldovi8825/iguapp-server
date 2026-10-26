// import "dotenv/config";
import { MongoClient } from "mongodb";

export const dbConfig = {
  client: new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  }),
  db() {
    return this.client.db("iguapp");
  },
  collection(collectionName) {
    return this.db().collection(collectionName);
  },
};
