const express = require('express')
const { append } = require('express/lib/response')
const async = require('hbs/lib/async')
const multer = require('multer')
const path = require('path')
const bodyParser = require('body-parser')
const { ObjectId, getDB, insertObject } = require('../databaseHandler')
const { rmSync } = require('fs')

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res) => {
    res.render('staff/index')
})

router.get('/uploadfile', (req, res) => {
    res.render('staff/uploadfile')
})

//set storage
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        var datetimestamp = Date.now()
        cb(null, file.fieldname + '_' + datetimestamp + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    var ext = path.extname(file.originalname)
    if (ext !== '.doc' && ext !== '.docx') {
        return cb(new Error('Please upload file doc or docx!'))
    }
    cb(null, true)
}

var upload = multer({ storage: storage, fileFilter: fileFilter })

router.post('/uploadfiles', upload.array('myFiles'), (req, res) => {
    const files = req.files
    const objectToFile = {
        files: files
    }
    insertObject('Files', objectToFile)
    res.send('success')
})

router.get('/staffIndex', async(req, res) => {
    const db = await getDB();
    const viewIdea = await db.collection("Ideas").find({}).toArray();
    console.log(viewIdea)
    res.render('staff/staffIndex', { data: viewIdea });
})

router.get('/upIdea', (req, res) => {
    res.render('staff/upIdea')
})
router.post('/uploadIdea', (req, res) => {
    const title = req.body.txtTitle;
    const text = req.body.txtText;
    const uploadIdea = {
        title: title,
        text: text
    }
    insertObject('Ideas', uploadIdea)
    res.render('staff/staffIndex')
})

router.get('/detailIdea', async(req, res) => {
    const id = req.query.id;

    const dbo = await getDB();
    const idea = await dbo.collection("Ideas").findOne({ _id: ObjectId(id) })
    res.render("staff/detailIdea", { i: idea })
})

module.exports = router