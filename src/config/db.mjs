// import "dotenv/config";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
	throw new Error("Falta la variable de entorno MONGODB_URI");
}

export const dbClient = new MongoClient(process.env.MONGODB_URI, {
	serverSelectionTimeoutMS: 5000,
	connectTimeoutMS: 10000,
});
