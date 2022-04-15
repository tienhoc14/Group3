const async = require('hbs/lib/async');
const { MongoClient, ObjectId } = require('mongodb');

// const URL = 'mongodb://0.0.0.0:27017';
const URL = 'mongodb+srv://admin:hsPOvEloe0djkzKP@cluster0.zcq0f.mongodb.net/test'
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
async function deleteManager(userName) {
    const dbo = await getDB();
    await dbo.collection("Manager").deleteOne({ "userName": userName });
    await dbo.collection("User").deleteOne({ "userName": userName })
}
async function deleteCoordinator(userName) {
    const dbo = await getDB();
    await dbo.collection("Coordinator").deleteOne({ "userName": userName });
    await dbo.collection("User").deleteOne({ "userName": userName })
}
async function deleteStaff(userName) {
    const dbo = await getDB();
    await dbo.collection("Staff").deleteOne({ "userName": userName });
    await dbo.collection("User").deleteOne({ "userName": userName })
}
async function deleteCategory(id) {
    const dbo = await getDB();
    await dbo.collection("Category").deleteOne({ "_id": ObjectId(id) });
}
async function deleteDepartment(id) {
    const dbo = await getDB();
    await dbo.collection("Department").deleteOne({ "_id": ObjectId(id) });
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
    getRole,
    deleteDepartment
}