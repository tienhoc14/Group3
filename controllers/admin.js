const express = require('express')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
const { getDB, insertObject, deleteCoordinator, deleteStaff, deleteManager} = require('../databaseHandler')


const router = express.Router()

router.get('/', (req, res) =>{
    res.render('adminIndex')
})

router.get('/adduser', (req, res) =>{
    res.render("addUser")
})

router.post('/addUser', async(req, res)=>{
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
    const objectToObject ={
        name: name,
        age: age,
        email: email,
        cccd: cccd,
        phoneNumber: phoneNumber,
        avatar: avatar,
        address: address
    }
    if(role == "Manager"){
        insertObject("User", objectToUser)
        insertObject("Manager", objectToObject)
    }else if(role == "Coordinator"){
        insertObject("User", objectToUser)
        insertObject("Coordinator", objectToObject)
    }else{
        insertObject("User", objectToUser)
        insertObject("Staff", objectToObject)
    }
    

    res.render("adminIndex")
})

router.get('/manager', async(req, res) =>{
    const dbo = await getDB();
    
    const allManager = await dbo.collection("Manager").find({}).toArray();
    res.render("mManager", {data: allManager})
})

router.get('/detailManager', async(req, res)=>{
    const id = req.query.id

    const dbo = await getDB();
    const allManager = await dbo.collection("Manager").findOne({ "_id": ObjectId(id) })
    res.render("detailManager", {data: allManager})
})

router.get('/editManager',async (req, res)=>{
    const id = req.query.id

    const dbo = await getDB();
    const allManager = await dbo.collection("Manager").findOne({ _id: ObjectId(id) })
    res.render("editManager", {data: allManager})
})

router.post('/update', async (req, res)=>{
    const id = req.body.Id
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
    const dbo = await getDB()
    await dbo.collection("Manager").updateOne(filter, objectToObject)
    const allManager = await dbo.collection("Manager").findOne({ _id: ObjectId(id) })
    res.render('mManager', { data: allManager })
})

router.get('/deleteManager', async(req, res)=>{
    const id = req.query.id;
    await deleteManager(id);
    res.render("mManager")
})

router.get('/coordinator', async (req, res) =>{
    const dbo = await getDB();
    const allCoordinator = await dbo.collection("Coordinator").find({}).toArray();
    res.render("mCoordinator", {base: allCoordinator})
})

router.get('/delete', async(req, res)=>{
    const id = req.query.id;
    await deleteCoordinator(id);
    res.render("mCoordinator")
})

router.get('/staff',async (req, res) =>{

    const dbo = await getDB();
    const allStaff = await dbo.collection("Staff").find({}).toArray();
    res.render("mStaff", {s: allStaff})
})

router.get('/delete', async(req, res)=>{
    const id = req.query.id;
    await deleteStaff(id);
    res.render("mStaff")
})

module.exports = router;