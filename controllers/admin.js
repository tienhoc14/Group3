const express = require('express')
const { render, send } = require('express/lib/response')
const async = require('hbs/lib/async')
const { ObjectId, MaxKey } = require('mongodb')
const { getDB, insertObject, deleteCoordinator, deleteStaff, deleteManager } = require('../databaseHandler')
const { requireAdmin } = require('../projectLibrary')

const router = express.Router()

router.get('/', requireAdmin, (req, res) => {
    const user = req.session["Admin"]
    res.render('admin/adminIndex', {user: user})
})

router.get('/adduser', requireAdmin, (req, res) => {
    const user = req.session["Admin"]
    res.render("admin/addUser", {user: user})
})

router.post('/addUser', requireAdmin, async(req, res) => {
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
        userName: userName,
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
    } else if (role == "Staff") {
        insertObject("User", objectToUser)
        insertObject("Staff", objectToObject)
    }

    res.render("admin/adminIndex")
})

router.get('/manager', requireAdmin, async(req, res) => {
    const user = req.session["Admin"]
    const dbo = await getDB();
    const allManager = await dbo.collection("Manager").find({}).toArray();
    res.render("admin/mManager", { data: allManager, user: user })
})

router.get('/detail_manager', requireAdmin, async(req, res) => {
    const id = req.query.id

    const dbo = await getDB();
    const allManager = await dbo.collection("Manager").findOne({ _id: ObjectId(id) })
    res.render("admin/detailManager", { data: allManager })
})

router.get('/edit_manager', requireAdmin, async(req, res) => {
    const id = req.query.id
    const user = req.session["Admin"]
    const dbo = await getDB();
    const allManager = await dbo.collection("Manager").findOne({_id: ObjectId(id)})
    res.render("admin/editManager", { data: allManager, user: user })
})

router.post('/update_manager', requireAdmin, async(req, res) => {
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

router.get('/delete_manager', requireAdmin, async(req, res) => {
    const user = req.query.userName;
    await deleteManager(user);
    res.redirect("/admin/manager")
})

router.get('/coordinator', requireAdmin, async(req, res) => {
    const dbo = await getDB();
    const allCoordinator = await dbo.collection("Coordinator").find({}).toArray();
    res.render("admin/mCoordinator", { c: allCoordinator })
})

router.get('/detail_coordinator', requireAdmin, async(req, res) => {
    const id = req.query.id

    const dbo = await getDB();
    const allStaff = await dbo.collection("Coordinator").findOne({ _id: ObjectId(id) })
    res.render("admin/detailCoordinator", { c: allStaff })
})

router.get('/edit_coordinator', requireAdmin, async(req, res) => {
    const id = req.query.id

    const dbo = await getDB();
    const allStaff = await dbo.collection("Coordinator").findOne({ _id: ObjectId(id) })
    res.render("admin/editCoordinator", { c: allStaff })
})

router.post('/update_coordinator', requireAdmin, async(req, res) => {
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
    const dbo = await getDB();
    await dbo.collection("Coordinator").updateOne(filter, objectToObject);
    const allStaff = await dbo.collection("Coordinator").find({}).toArray()
    res.render('admin/mCoordinator', { c: allStaff })
})

router.get('/delete_coordinator', requireAdmin, async(req, res) => {
    const user = req.query.userName;
    await deleteCoordinator(user);
    res.redirect("/admin/coordinator")
})

router.get('/staff', requireAdmin, async(req, res) => {

    const dbo = await getDB();
    const allStaff = await dbo.collection("Staff").find({}).toArray();
    res.render("admin/mStaff", { s: allStaff })
})

router.get('/detail_staff', requireAdmin, async(req, res) => {
    const id = req.query.id

    const dbo = await getDB();
    const allStaff = await dbo.collection("Staff").findOne({ _id: ObjectId(id) })
    res.render("admin/detailStaff", { s: allStaff })
})

router.post('/update_staff', requireAdmin, async(req, res) => {
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
    const dbo = await getDB();
    await dbo.collection("Staff").updateOne(filter, objectToObject);
    const allStaff = await dbo.collection("Staff").find({}).toArray()
    res.render('admin/mStaff', { s: allStaff })
})

router.get('/edit_staff', requireAdmin, async(req, res) => {
    const id = req.query.id

    const dbo = await getDB();
    const allStaff = await dbo.collection("Staff").findOne({ _id: ObjectId(id) })
    res.render("admin/editStaff", { s: allStaff })
})

router.get('/delete_staff', requireAdmin, async(req, res) => {
    const user = req.query.userName;
    await deleteStaff(user);
    res.redirect("/admin/staff")
})

router.get('/ideas', requireAdmin, async(req, res) => {
    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find({}).toArray()
    res.render("admin/viewIdeas", { i: allIdeas })
})

router.get('/mostView', async(req, res) => {

    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ view: -1 }).toArray()
    res.render("admin/viewIdeas", { i: allIdeas })
})

router.get('/mostLike', async(req, res)=>{
    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ like: -1 }).toArray()
    res.render("admin/viewIdeas", { i: allIdeas })
})
router.get('/mostDislike', async(req, res)=>{
    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ dislike: -1 }).toArray()
    res.render("admin/viewIdeas", { i: allIdeas })
})

//set closure date
router.get('/setdate', requireAdmin, (req, res) => {
    res.render('admin/setDate')
})

module.exports = router;