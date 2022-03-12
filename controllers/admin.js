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

    res.render("mManager")
})

router.get('/addManager', async(req, res)=>{

    res.render("addManager")
})

router.get('/detail', async(req, res)=>{

    const dbo = await getDB();
    const allManager = await dbo.collection("Manager").find({}).toArray();
    res.render("detailManager", {data: allManager})
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