const express = require('express')
const { ObjectId } = require('mongodb')
const { getDB, insertObject, deleteCategory } = require('../databaseHandler')

const router = express.Router()

router.use(express.static('public'))

router.get('/', (req, res) => {
    res.render('manager/indexManager')
})

router.get('/category', (req, res) => {
    res.render('manager/category')
})

router.get('/addCategory', async (req, res) => {
    const dbo = await getDB();
    const allCategory = await dbo.collection("Category").find({}).toArray();
    res.render("manager/addCategory", {data: allCategory})
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
    const allCategory= await dbo.collection("Category").findOne({ _id: ObjectId(id) })
    res.render("editCategory", {data: allCategory})
})

router.get('/deleteCategory', async(req, res)=>{
    const id = req.query.id;
    await deleteCategory(id);
    res.render("manager/category")
})

module.exports = router;