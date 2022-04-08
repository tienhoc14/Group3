const express = require('express')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
const { getDB, insertObject, deleteCategory } = require('../databaseHandler')

const router = express.Router()

router.use(express.static('public'))



router.get('/', async(req, res) => {

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

//Terms and Conditions:

// router.get('/TaC', async(req, res) => {
//     res.render("staff/TaC")
// })

module.exports = router;