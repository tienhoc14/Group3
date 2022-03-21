const async = require('hbs/lib/async');
const { MongoClient, ObjectId } = require('mongodb');

const URL = 'mongodb://0.0.0.0:27017';
const DATABASE_NAME = "GCH0805_1640"

async function getDB() {
    const client = await MongoClient.connect(URL)
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}

async function insertObject(collectionName, objectToInsert) {
    const dbo = await getDB();
    const newObject = await dbo.collection(collectionName).insertOne(objectToInsert);
}
async function deleteManager(id) {
    const dbo = await getDB();
    await dbo.collection("Manager").deleteOne({ "_id": ObjectId(id) });
}
async function deleteCoordinator(id) {
    const dbo = await getDB();
    await dbo.collection("Coordinator").deleteOne({ "_id": ObjectId(id) });
}
async function deleteStaff(id) {
    const dbo = await getDB();
    await dbo.collection("Staff").deleteOne({ "_id": ObjectId(id) });
}
async function deleteCategory(id) {
    const dbo = await getDB();
    await dbo.collection("Category").deleteOne({ "_id": ObjectId(id) });
}

//check role to login
async function getRole(nameI, passI) {
    const db = await getDB()
    const user = await db.collection("User").findOne({ userName: nameI, password: passI });
    if (user == null) {
        return "-1"
    } else {
        console.log(user);
        return user.role
    }
}

module.exports = {
    getDB,
    ObjectId,
    insertObject,
    deleteCoordinator,
    deleteManager,
    deleteStaff,
    deleteCategory,
    getRole
}