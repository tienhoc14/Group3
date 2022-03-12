const express = require('express')
const { ObjectId } = require('mongodb')
const { insertObject } = require('../databaseHandler')

const router = express.Router()

router.use(express.static('public'))

router.get('/category', (req, res) => {
    res.render('category')
})

router.get('/addCategory', async (req, res) => {

    res.render("addCategory")
})

router.post('/addCategory', async (req, res) => {
    const name = req.body.txtName;
    const catgory = req.body.txtCategory;
    const objectToManager = {
        name: name,
        catgory: catgory
    }
    insertObject("Category", objectToManager)
    res.render("manager")
})

router.get('/editCategory', async (req, res) => {

    res.render("editCategory")
})

router.post('/editCategory', async (req, res) => {
    const name = req.body.txtName;
    const catgory = req.body.txtCategory;
    const objectToManager = {
        name: name,
        catgory: catgory
    }
    insertObject("Category", objectToManager)
    res.render("manager")
})

router.get('/deleteCategory', async(req, res)=>{
    const id = req.query.id;
    await deleteManager(id);
    res.render("category")
})

module.exports = router;