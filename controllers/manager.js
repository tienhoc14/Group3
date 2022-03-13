const express = require('express')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
const { getDB, insertObject, deleteCategory } = require('../databaseHandler')

const router = express.Router()

router.use(express.static('public'))

router.get('/', (req, res) => {
    res.render('manager/indexManager')
})

router.get('/category',async (req, res) => {

    const dbo = await getDB();
    const allCategory = await dbo.collection("Category").find({}).toArray();
    res.render('manager/category', {data: allCategory})
})

router.get('/addCategory', async (req, res) => {
    res.render("manager/addCategory")
})

router.post('/addCategory', async (req, res) => {
    const name = req.body.txtName;
    const description = req.body.txtDescription;
    const objectToCategory = {
        name: name,
        description: description
    }
    insertObject("Category", objectToCategory)
    res.render("manager/category")
})

router.get('/editCategory',async (req, res)=>{
    const id = req.query.id

    const dbo = await getDB();
    const allCategory = await dbo.collection("Category").findOne({_id: ObjectId(id)})
    res.render("manager/editCategory", {data: allCategory})
})

router.post('/editCategory', async (req, res)=>{
    const name = req.body.txtName;
    const description = req.body.txtDescription;

    const objectToObject = {
        $set: {
            name: name,
            description: description
        }
    }
    const filter = { _id: ObjectId(id) }
    const dbo = await getDB()
    await dbo.collection("Category").updateOne(filter, objectToObject)
    const allCategory = await dbo.collection("Category").find({}).toArray()
    res.render('manager/category', { data: allCategory })
})

router.get('/deleteCategory', async(req, res)=>{
    const name = req.query.name;
    await deleteCategory(name);
    res.render("manager/category")
})

module.exports = router;