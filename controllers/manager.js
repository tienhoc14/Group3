const express = require('express')
const { ObjectId } = require('mongodb')
const { insertObject } = require('../databaseHandler')

const router = express.Router()

router.use(express.static('public'))

router.get('/', (req, res) => {
    res.render('manager/indexManager')
})

router.get('/category', (req, res) => {
    res.render('manager/category')
})

router.get('/addCategory', async (req, res) => {

    res.render("manager/addCategory")
})

router.post('/addCategory', async (req, res) => {
    const name = req.body.txtName;
    const catgory = req.body.txtCategory;
    const objectToManager = {
        name: name,
        catgory: catgory
    }
    insertObject("Category", objectToManager)
    res.render("manager/category")
})

router.get('/editCategory',async (req, res)=>{
    const id = req.query.id

    const dbo = await getDB();
    const allManager = await dbo.collection("Category").findOne({ _id: ObjectId(id) })
    res.render("editCategory", {data: allCategory})
})

router.get('/deleteCategory', async(req, res)=>{
    const id = req.query.id;
    await deleteCategory(id);
    res.render("manager/category")
})

module.exports = router;