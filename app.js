const express = require('express')
const session = require('express-session')
const async = require('hbs/lib/async')
const { getRole, getDB } = require('./databaseHandler')
const { ObjectId } = require('mongodb')
const nodemailer = require('nodemailer');


const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.set('view engine', 'hbs')

io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('user-comment', async data => {
        console.log('user-comment connected')
        const db = await getDB();
        await db.collection('Ideas').updateOne({ _id: ObjectId(data.id) }, {
            $push: {
                'comment': {
                    name: data.name,
                    content: data.msg
                }
            }
        })

        const a = await db.collection('Ideas').findOne({ _id: ObjectId(data.id) })
        const p = await db.collection('Staff').findOne({ 'userName': a.user.name })
        console.log(p.email)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'cuongnmgch190696@fpt.edu.vn',
                pass: '23122001c'
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        var mailOptions = {
            from: 'cuongnmgch190696@fpt.edu.vn',
            to: p.email,
            subject: 'Idea',
            text: 'Have a person comment for idea of you'
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        io.emit('server-response', data)

    })
    socket.on('client-like', async data => {
        const db = await getDB();
        const x = await db.collection('Ideas').findOne({ $and: [{ _id: ObjectId(data.id) }, { 'like': data.user }] });
        const y = await db.collection('Ideas').findOne({ $and: [{ _id: ObjectId(data.id) }, { 'dislike': data.user }] });
        if (x == null) {
            if (y != null) {
                await db.collection('Ideas').updateOne({ _id: ObjectId(data.id) }, {
                    $pull: {
                        'dislike': data.user
                    }
                })
                await db.collection('Ideas').updateOne({ _id: ObjectId(data.id) }, {
                    $push: {
                        'like': data.user
                    }
                })
            } else {
                await db.collection('Ideas').updateOne({ _id: ObjectId(data.id) }, {
                    $push: {
                        'like': data.user
                    }
                })
            }
        } else {
            await db.collection('Ideas').updateOne({ _id: ObjectId(data.id) }, {
                $pull: {
                    'like': data.user
                }
            })
        }
        const idea = await db.collection("Ideas").findOne({ _id: ObjectId(data.id) })
        const likes = idea.like.length
        const dislikes = idea.dislike.length
        io.emit('server-like', { likes, dislikes })
    })
    socket.on('client-dislike', async data => {
        const db = await getDB();
        const x = await db.collection('Ideas').findOne({ $and: [{ _id: ObjectId(data.id) }, { 'dislike': data.user }] });
        const y = await db.collection('Ideas').findOne({ $and: [{ _id: ObjectId(data.id) }, { 'like': data.user }] });
        if (x == null) {
            if (y != null) {
                await db.collection('Ideas').updateOne({ _id: ObjectId(data.id) }, {
                    $pull: {
                        'like': data.user
                    }
                })
                await db.collection('Ideas').updateOne({ _id: ObjectId(data.id) }, {
                    $push: {
                        'dislike': data.user
                    }
                })
            } else {
                await db.collection('Ideas').updateOne({ _id: ObjectId(data.id) }, {
                    $push: {
                        'dislike': data.user
                    }
                })
            }
        } else {
            await db.collection('Ideas').updateOne({ _id: ObjectId(data.id) }, {
                $pull: {
                    'dislike': data.user
                }
            })
        }
        const idea = await db.collection("Ideas").findOne({ _id: ObjectId(data.id) })
        const likes = idea.like.length
        const dislikes = idea.dislike.length
        io.emit('server-dislike', { likes, dislikes })
    })
});


app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    key: 'user_id',
    secret: '124447yd@@$%%#',
    cookie: { maxAge: 900000 },
    saveUninitialized: false,
    resave: false
}))

app.get('/index', (req, res) => {
    res.render('index')
})
app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/', (req, res) => {
    res.render('login')
})

app.post('/login', async(req, res) => {
    const name = req.body.Username
    const pass = req.body.Password
    const role = await getRole(name, pass)
    if (role == -1) {
        res.render('login')
    } else if (role == "Admin") {
        req.session["Admin"] = {
            name: name,
            role: role
        }
        res.redirect('/admin')

    } else if (role == "Staff") {
        req.session["Staff"] = {
            name: name,
            role: role
        }
        res.redirect('/staff/staffIndex')

    } else if (role == "Coordinator") {
        req.session["Coordinator"] = {
            name: name,
            role: role
        }
        res.redirect('/coordinator')
    } else if (role == "Manager") {
        req.session["Manager"] = {
            name: name,
            role: role
        }
        res.redirect('/manager')
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('login')
})

app.post('/setDate', (req, res) => {
    const open = new Date(req.body.openDate)
    const close = new Date(req.body.closeDate)
    const now = new Date()
    if (open <= now && now <= close) {
        res.send('index')
    } else {
        res.send('disable function')
    }
})

const adminController = require('./controllers/admin')
app.use('/admin', adminController)

const staffController = require('./controllers/staff')
app.use('/staff', staffController)

const managerController = require('./controllers/manager')
app.use('/manager', managerController)

const coordinatorController = require('./controllers/coordinator')
app.use('/coordinator', coordinatorController)

app.get('/staff/detailidea', (req, res) => {
    res.render('staff/detailIdea');
});

const PORT = process.env.PORT || 5123
http.listen(PORT)
console.log("Server is running! " + PORT)