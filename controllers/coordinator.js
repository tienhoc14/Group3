const express = require('express')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
const { getDB, insertObject, deleteDepartment } = require('../databaseHandler')
const nodemailer = require('nodemailer');
const { requireCoordinator } = require('../projectLibrary')
const router = express.Router()

router.get('/', requireCoordinator, (req, res) => {
    res.render("coordinator/index")
})

router.get('/department', async(req, res) => {

    const dbo = await getDB();
    const allDepartment = await dbo.collection("Department").find({}).toArray();
    res.render('coordinator/department', { data: allDepartment })
})

router.get('/editDepartment', async(req, res) => {
    const id = req.query.id

    const dbo = await getDB();
    const allDepartment = await dbo.collection("Department").findOne({ _id: ObjectId(id) })
    res.render("coordinator/editDepartment", { data: allDepartment })
})

router.post('/updateDepartment', async(req, res) => {
    const name = req.body.txtName;

    const id = req.body.ID;

    const objectToObject = {
        $set: {
            name: name
        }
    }

    const filter = { _id: ObjectId(id) }
    const dbo = await getDB()
    await dbo.collection("Department").updateOne(filter, objectToObject)

    res.redirect('/coordinator/department')
})

router.get('/deleteDepartment', async(req, res) => {
    const id = req.query.id;
    await deleteDepartment(id);
    res.redirect("/coordinator/department")
})





//Ideas
router.get('/ideas', requireCoordinator, async (req, res) =>{
    const dbo = await getDB()
    const ideas = await dbo.collection("Ideas").find({}).toArray()
    res.render("coordinator/mnIdeas", {i : ideas})
})

//Most like, dislike, view

router.get('/mostView', requireCoordinator, async(req, res) => {

    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ view: -1 }).toArray()
    res.render("coordinator/mnIdeas", {i : allIdeas})
})

router.get('/mostLike',requireCoordinator, async(req, res) => {
    
    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ like: -1 }).toArray()
    res.render("coordinator/mnIdeas", {i : allIdeas})
})
router.get('/mostDislike',requireCoordinator, async(req, res) => {
    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ dislike: -1 }).toArray()
    res.render("coordinator/mnIdeas", {i : allIdeas})
})

module.exports = router