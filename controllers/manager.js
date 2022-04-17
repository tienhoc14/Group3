const express = require('express')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
const { getDB, insertObject, deleteCategory, deleteDepartment } = require('../databaseHandler')
const { requireManager } = require('../projectLibrary')

const router = express.Router()

router.use(express.static('public'))


router.get('/', async(req, res) => {
    res.render("manager/")
})
router.get('/category', async(req, res) => {

    const dbo = await getDB();
    const allCategory = await dbo.collection("Category").find({}).toArray();
    res.render('manager/category', { data: allCategory })
})

router.get('/addCategory', async(req, res) => {
    res.render("manager/addCategory")
})

router.post('/addCategory', async(req, res) => {
    const name = req.body.txtName;
    const description = req.body.txtDescription;
    const objectToCategory = {
        name: name,
        description: description
    }
    insertObject("Category", objectToCategory)
    res.redirect("/manager/")
})

router.get('/editCategory', async(req, res) => {
    const id = req.query.id

    const dbo = await getDB();
    const allCategory = await dbo.collection("Category").findOne({ _id: ObjectId(id) })
    res.render("manager/editCategory", { data: allCategory })
})

router.post('/updateCategory', async(req, res) => {
    const name = req.body.txtName;
    const description = req.body.txtDescription;
    const id = req.body.ID;

    const objectToObject = {
        $set: {
            name: name,
            description: description
        }
    }

    const filter = { _id: ObjectId(id) }
    const dbo = await getDB()
    await dbo.collection("Category").updateOne(filter, objectToObject)

    res.redirect('/manager/')
})

router.get('/deleteCategory', async(req, res) => {
    const id = req.query.id;
    await deleteCategory(id);
    res.redirect("/manager/")
})

//Department
router.get('/department', async(req, res) => {

    const dbo = await getDB();
    const allDepartment = await dbo.collection("Department").find({}).toArray();
    res.render('manager/department', { data: allDepartment })
})

router.get('/addDepartment', async(req, res) => {
    res.render("manager/addDepartment")
})

router.post('/addDepartment', async(req, res) => {
    const name = req.body.txtName;
    const des = req.body.txtDes;
    const staff = [];
    const objectToDepartment = {
        name: name,
        des: des,
        staff:staff
    }
    insertObject("Department", objectToDepartment)
    res.redirect("/manager/department")
})
router.get('/editDepartment', async(req, res) => {
    const id = req.query.id

    const dbo = await getDB();
    const allDepartment = await dbo.collection("Department").findOne({ _id: ObjectId(id) })
    res.render("manager/editDepartment", { data: allDepartment })
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

    res.redirect('/manager/department')
})

router.get('/deleteDepartment', async(req, res) => {
    const id = req.query.id;
    await deleteDepartment(id);
    res.redirect("/manager/department")
})

//Terms and Conditions:

// router.get('/TaC', async(req, res) => {
//     res.render("staff/TaC")
// })

//Ideas
router.get('/allIdeas', requireManager, async(req, res) => {
    const dbo = await getDB()
    const ideas = await dbo.collection("Ideas").find({}).toArray()
    res.render("manager/ideas", { i: ideas })
})

// Dashboard
router.get('/dashboard', async(req, res) => {
    res.render("manager/dashboard")
})

//Most like, dislike, view

router.get('/mostView', async(req, res) => {

    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ view: -1 }).toArray()
    res.render("manager/ideas", { i: allIdeas })
})

router.get('/mostLike', async(req, res) => {
    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ like: -1 }).toArray()
    res.render("manager/ideas", { i: allIdeas })
})
router.get('/mostDislike', async(req, res) => {
    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ dislike: -1 }).toArray()
    res.render("manager/ideas", { i: allIdeas })
})
module.exports = router;