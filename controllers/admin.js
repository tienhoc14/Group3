const express = require('express')
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

    const objectToUser = {
        userName: userName,
        role: role,
        password: pass
    }
    insertObject("User", objectToUser)
    res.render("adminIndex")
})

router.get('/manager', async(req, res) =>{

    res.render("mManager")
    console.log(allManager);
})

router.get('/addManager', async(req, res)=>{

    res.render("addManager")
})

router.get('/detail', async(req, res)=>{

    const dbo = await getDB();
    const allManager = await dbo.collection("Manager").find({}).toArray();
    res.render("detailManager", {data: allManager})
})

router.post('/addManager', async(req, res)=>{
    const cccd = req.body.txtCm;
    const name = req.body.txtName;
    const age = req.body.txtAge;
    const email = req.body.txtEmail;
    const phoneNumber = req.body.txtPhone;
    const avatar = req.body.txtAva;
    const address = req.body.txtAddress;

    const objectToManager ={
        name: name,
        age: age,
        email: email,
        cccd: cccd,
        phoneNumber: phoneNumber,
        avatar: avatar,
        address: address
    }
    insertObject("Manager", objectToManager)
    res.render("mManager")
})
router.get('/delete', async(req, res)=>{
    const id = req.query.id;
    await deleteManager(id);
    res.render("mManager")
})

router.get('/coordinator', async (req, res) =>{
    const dbo = await getDB();
    const allCoordinator = await dbo.collection("Coordinator").find({}).toArray();
    res.render("mCoordinator", {base: allCoordinator})
})

router.post('/addCoordinator', async(req, res)=>{
    const cccd = req.body.txtCm;
    const name = req.body.txtName;
    const age = req.body.txtAge;
    const email = req.body.txtEmail;
    const phoneNumber = req.body.txtPhone;
    const avatar = req.body.txtAva;
    const address = req.body.txtAddress;

    const objectToCoodinator ={
        name: name,
        age: age,
        email: email,
        cccd: cccd,
        phoneNumber: phoneNumber,
        avatar: avatar,
        address: address
    }
    insertObject("Coodinator", objectToCoodinator)
    res.render("mCoordinator")
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

router.post('/addStaff', async(req, res)=>{
    const cccd = req.body.txtCm;
    const name = req.body.txtName;
    const age = req.body.txtAge;
    const email = req.body.txtEmail;
    const phoneNumber = req.body.txtPhone;
    const avatar = req.body.txtAva;
    const address = req.body.txtAddress;

    const objectToStaff ={
        name: name,
        age: age,
        email: email,
        cccd: cccd,
        phoneNumber: phoneNumber,
        avatar: avatar,
        address: address
    }
    insertObject("Staff", objectToStaff)
    res.reender("mStaff")
})



router.get('/delete', async(req, res)=>{
    const id = req.query.id;
    await deleteStaff(id);
    res.render("mStaff")
})

module.exports = router;