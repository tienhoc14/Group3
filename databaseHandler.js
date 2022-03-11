const { MongoClient, ObjectId } = require('mongodb');

// const URL = 'mongodb+srv://1670ASM:1411@cluster0.6pxwq.mongodb.net/test';
const URL = 'mongodb://localhost:27017';
const DATABASE_NAME = "GCH0805-ApplicationDev"

async function getDB() {
    const client = await MongoClient.connect(URL)
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}