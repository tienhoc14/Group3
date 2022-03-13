const express = require('express')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
const { getDB, insertObject, deleteCoordinator, deleteStaff, deleteManager } = require('../databaseHandler')

const router = express.Router()

router.get('/', (req, res) =>{
    res.render('admin/adminIndex')
})

router.get('/adduser', (req, res) =>{
    res.render("admin/addUser")
})

router.post('/addUser', async(req, res) => {
    const userName = req.body.txtUser;
    const role = req.body.Role;
    const pass = req.body.txtPass;
    const cccd = req.body.txtCm;
    const name = req.body.txtName;
    const age = req.body.txtAge;
    const email = userName + "@fpt.edu.vn"
    const phoneNumber = req.body.txtPhone;
    const avatar = req.body.txtAva;
    const address = req.body.txtAddress;

    const objectToUser = {
        userName: userName,
        role: role,
        password: pass
    }
    const objectToObject = {
        name: name,
        age: age,
        email: email,
        cccd: cccd,
        phoneNumber: phoneNumber,
        avatar: avatar,
        address: address
    }
    if (role == "Manager") {
        insertObject("User", objectToUser)
        insertObject("Manager", objectToObject)
    } else if (role == "Coordinator") {
        insertObject("User", objectToUser)
        insertObject("Coordinator", objectToObject)
    } else {
        insertObject("User", objectToUser)
        insertObject("Staff", objectToObject)
    }

    res.render("admin/adminIndex")
})

router.get('/manager', async(req, res) => {
    const dbo = await getDB();

    const allManager = await dbo.collection("Manager").find({}).toArray();
    res.render("admin/mManager", {data: allManager})
})

router.get('/detail_manager', async(req, res)=>{
    const id = req.query.id

    const dbo = await getDB();
    const allManager = await dbo.collection("Manager").findOne({ _id: ObjectId(id) })
    res.render("admin/detailManager", {data: allManager})
})

router.get('/edit_manager',async (req, res)=>{
    const id = req.query.id

    const dbo = await getDB();
    const allManager = await dbo.collection("Manager").findOne({_id: ObjectId(id)})
    res.render("admin/editManager", {data: allManager})
})

router.post('/update_manager', async (req, res)=>{
    const id = req.body.txtId
    const cccd = req.body.txtCm;
    const name = req.body.txtName;
    const age = req.body.txtAge;
    const phoneNumber = req.body.txtPhone;
    const avatar = req.body.txtAva;
    const address = req.body.txtAddress;

    const objectToObject = {
        $set: {
            name: name,
            age: age,
            cccd: cccd,
            phoneNumber: phoneNumber,
            avatar: avatar,
            address: address
        }
    }
    const filter = { _id: ObjectId(id) }
    const dbo = await getDB()
    await dbo.collection("Manager").updateOne(filter, objectToObject)
    const allManager = await dbo.collection("Manager").find({}).toArray()
    res.render('admin/mManager', { data: allManager })
})

router.get('/delete_manager', async(req, res)=>{
    const id = req.query.id;
    await deleteManager(id);
    res.render("admin/mManager")
})

router.get('/coordinator', async(req, res) => {
    const dbo = await getDB();
    const allCoordinator = await dbo.collection("Coordinator").find({}).toArray();
    res.render("admin/mCoordinator", {c: allCoordinator})
})

router.get('/detail_coordinator', async(req, res)=>{
    const id = req.query.id

    const dbo = await getDB();
    const allStaff = await dbo.collection("Coordinator").findOne({ _id: ObjectId(id) })
    res.render("admin/detailCoordinator", {c: allStaff})
})

router.get('/edit_coordinator', async(req, res)=>{
    const id = req.query.id

    const dbo = await getDB();
    const allStaff = await dbo.collection("Coordinator").findOne({ _id: ObjectId(id) })
    res.render("admin/editCoordinatorf", {c: allStaff})
})

router.post('/update_coordinator', async (req, res)=>{
    const id = req.body.txtId
    const cccd = req.body.txtCm;
    const name = req.body.txtName;
    const age = req.body.txtAge;
    const phoneNumber = req.body.txtPhone;
    const avatar = req.body.txtAva;
    const address = req.body.txtAddress;

    const objectToObject ={
        $set: {
            name: name,
            age: age,
            cccd: cccd,
            phoneNumber: phoneNumber,
            avatar: avatar,
            address: address
        }
    }
    const filter = { _id: ObjectId(id)}
    const dbo = await getDB();
    await dbo.collection("Coordinator").updateOne(filter, objectToObject);
    const allStaff = await dbo.collection("Coordinator").find({}).toArray()
    res.render('admin/mCoordinator', { c: allStaff })
})

router.get('/delete_coordinator', async(req, res)=>{
    const id = req.query.id;
    await deleteCoordinator(id);
    res.render("admin/mCoordinator")
})

router.get('/staff', async(req, res) => {

    const dbo = await getDB();
    const allStaff = await dbo.collection("Staff").find({}).toArray();
    res.render("admin/mStaff", {s: allStaff})
})

router.get('/detail_staff', async(req, res)=>{
    const id = req.query.id

    const dbo = await getDB();
    const allStaff = await dbo.collection("Staff").findOne({ _id: ObjectId(id) })
    res.render("admin/detailStaff", {s: allStaff})
})

router.post('/update_staff', async (req, res)=>{
    const id = req.body.txtId
    const cccd = req.body.txtCm;
    const name = req.body.txtName;
    const age = req.body.txtAge;
    const phoneNumber = req.body.txtPhone;
    const avatar = req.body.txtAva;
    const address = req.body.txtAddress;

    const objectToObject ={
        $set: {
            name: name,
            age: age,
            cccd: cccd,
            phoneNumber: phoneNumber,
            avatar: avatar,
            address: address
        }
    }
    const filter = { _id: ObjectId(id)}
    const dbo = await getDB();
    await dbo.collection("Staff").updateOne(filter, objectToObject);
    const allStaff = await dbo.collection("Staff").find({}).toArray()
    res.render('admin/mStaff', { s: allStaff })
})

router.get('/edit_staff', async(req, res)=>{
    const id = req.query.id

    const dbo = await getDB();
    const allStaff = await dbo.collection("Staff").findOne({ _id: ObjectId(id) })
    res.render("admin/editStaff", {s: allStaff})
})

router.get('/delete_staff', async(req, res)=>{
    const id = req.query.id;
    await deleteStaff(id);
    res.render("admin/mStaff")
})

module.exports = router;