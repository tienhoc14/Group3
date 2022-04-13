const express = require('express')
const { getDB } = require('../databaseHandler')
const nodemailer = require('nodemailer');
const { requireCoordinator } = require('../projectLibrary')

const router = express.Router()

router.get('/', requireCoordinator, (req, res) => {
    res.render("coordinator/index")
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