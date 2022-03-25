const express = require('express')
const { append } = require('express/lib/response')
const async = require('hbs/lib/async')
const multer = require('multer')
const path = require('path')
const nodemailer = require('nodemailer');
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

router.get('/staffIndex', async (req, res) => {
    const db = await getDB();
    const viewIdea = await db.collection("Ideas").find({}).toArray();
    console.log(viewIdea)
    res.render('staff/staffIndex', { data: viewIdea });
})


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'minhhqgch190485@fpt.edu.vn',
        pass: 'minh212212'
    },
    tls: {
        rejectUnauthorized: false,
    }
});

var mailOptions = {
    from: 'minhhqgch190485@fpt.edu.vn',
    to: 'hmminh212@gmail.com',
    subject: 'Idea',
    text: 'Just uploaded an idea'
};

router.get('/upIdea', (req, res) => {
    res.render('staff/upIdea')
})
router.post('/uploadIdea', (req, res) => {
    const title = req.body.txtTitle;
    const text = req.body.txtText;
    const like = [];
    const dislike = [];
    const view = 0;
    const comment = [];
    const uploadIdea = {
        title: title,
        text: text,
        view: view,
        like: like,
        dislike: dislike,
        view: view,
        comment: comment
    }
    insertObject('Ideas', uploadIdea)

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.redirect('staffIndex')
})

router.get('/detailIdea', async (req, res) => {
    const id = req.query.id;
    const db = await getDB();
    await db.collection("Ideas").updateOne({ _id: ObjectId(id) }, { $inc: { "view": 1 } })
    const idea = await db.collection("Ideas").findOne({ _id: ObjectId(id) })
    res.render("staff/detailIdea", { i: idea })
})


module.exports = router