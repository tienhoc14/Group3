const express = require('express')
const { append, redirect } = require('express/lib/response')
const async = require('hbs/lib/async')
const multer = require('multer')
const path = require('path')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')
const { ObjectId, getDB, insertObject } = require('../databaseHandler')
const { rmSync } = require('fs')
const { requireStaff } = require('../projectLibrary');
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.get('/noPost', (req, res) => {
    res.render('staff/noPost')
})

router.get('/staffIndex',requireStaff, async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const start = (page - 1) * perPage;
    const end = page * perPage;
    const previousPage = page - 1;
    const nextPage = page + 1;
    var check1 = new Boolean(true);
    var check2 = new Boolean(true);
    
    // const bt = parseInt(req.query.bt)
    // console.log(bt)
    const user = req.session["Staff"]
    const db = await getDB();
    const totalItem = await db.collection("Ideas").find({}).toArray();
    const lastPage = (totalItem.length - totalItem.length % 5) / 5 + 1;
    if (page == 1) {
        check1 = Boolean(false)
    }
    if (page == lastPage) {
        check2 = Boolean(false)
    }
    const p = await db.collection("Staff").findOne({ "userName": user.name })
    const viewIdea = await (await db.collection("Ideas").find({}).toArray()).slice(start, end);
    

    res.render('staff/staffIndex', {user:p, check1: check1, check2: check2, data: viewIdea, lastPage: lastPage, page: page, previousPage: previousPage, nextPage: nextPage });
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hhoa66008@gmail.com',
        pass: 'nhung2906'
    },
    tls: {
        rejectUnauthorized: false,
    }
});

var mailOptions = {
    from: 'hhoa66008@gmail.com',
    to: 'hoahpgch190653@fpt.edu.vn',
    subject: 'Idea',
    text: 'Just uploaded an idea'
};

router.get('/upIdea', requireStaff, async(req, res) => {
    const user = req.session["Staff"]
    const db = await getDB();
    const allCategory = await db.collection("Category").find({}).toArray();
    const info = await db.collection("Staff").findOne({ "userName": user.name });
    console.log(user)
    const now = new Date();
    const dbo = await getDB()
    const deadline = await dbo.collection("SetDate").findOne({ code: "cuong" })

    var check = Boolean(false)
    if (deadline.openDate < now && now < deadline.closeDate) {
        check = Boolean(true)
    }

    res.render('staff/upIdea', { check: check, staff: info, category: allCategory })
})

//set files storage
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        var datetimestamp = Date.now()
        cb(null, file.fieldname + '_' + datetimestamp + path.extname(file.originalname))
    }
})

//filter files type
const fileFilter = (req, file, cb) => {
    var ext = path.extname(file.originalname)
    if (ext !== '.doc' && ext !== '.docx') {
        return cb(new Error('Please upload file doc or docx!'))
    }
    cb(null, true)
}

var upload = multer({ storage: storage, fileFilter: fileFilter })

router.post('/uploadIdea', upload.array('myFiles'), (req, res) => {
    const user = req.session["Staff"]
    const title = req.body.txtTitle;
    const text = req.body.txtText;
    const category = req.body.Category;
    var privacy = req.body.privacy;
    const like = [];
    const dislike = [];
    const view = 0;
    const comment = [];
    const date = new Date();
    const files = req.files;
    if (privacy == 'public') {
        privacy = user.name
    }
    const uploadIdea = {
        user: user,
        title: title,
        text: text,
        category: category,
        privacy: privacy,
        view: view,
        like: like,
        dislike: dislike,
        comment: comment,
        date: date,
        files: files
    }
    insertObject('Ideas', uploadIdea)

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.redirect('staffIndex')
})

router.get('/detailIdea', requireStaff, async(req, res) => {
    const id = req.query.id;
    const rv = req.query.reverse;
    const user = req.session["Staff"]
    const db = await getDB();
    await db.collection("Ideas").updateOne({ _id: ObjectId(id) }, { $inc: { "view": 1 } })
    const idea = await db.collection("Ideas").findOne({ _id: ObjectId(id) })

    const p = await db.collection("Staff").findOne({ "userName": user.name })

    if (rv == "1") {
        idea.comment.reverse()
    }
    res.render("staff/detailIdea", { i: idea, user: p })
})

// Latest Ideas
router.get('/latestIdea', async(req, res) => {
        const dbo = await getDB();
        const allIdeas = await (await dbo.collection("Ideas").find().sort({ date: -1 }).toArray()).slice(0, 4)
        res.render("staff/staffIndex", { data: allIdeas })
    })
    // 

router.get('/mostView', async(req, res) => {

    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ view: -1 }).toArray()
    res.render("staff/staffIndex", { data: allIdeas })
})

router.get('/mostLike', async(req, res) => {
    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ like: -1 }).toArray()
    res.render("staff/staffIndex", { data: allIdeas })
})
router.get('/mostDislike', async(req, res) => {
    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ dislike: -1 }).toArray()
    res.render("staff/staffIndex", { data: allIdeas })
})



module.exports = router