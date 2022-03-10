const express = require('express')
// const session = require('express-session')
// const { checkUserRole } = require('./databaseHandler')
// const { requiresLogin } = require('./projectLibrary')

const app = express()

app.set('view engine', 'hbs')

app.use(express.static('public'))


// app.get('/', (req, res) => {
//     res.render('login')
// })
// app.get('/login', (req, res) => {
//     res.render('login')
// })
app.get('/', (req, res) => {
        res.render('')
})


app.use(express.urlencoded({ extended: true }))
const PORT = process.env.PORT || 5123
app.listen(PORT)
console.log("Server is running! " + PORT)