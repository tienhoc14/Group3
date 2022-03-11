const { MongoClient, ObjectId } = require('mongodb');

const URL = 'mongodb://localhost:27017';
const DATABASE_NAME = "GCH0805_1640"

async function getDB() {
    const client = await MongoClient.connect(URL)
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}
module.exports = {
    getDB, ObjectId,
}