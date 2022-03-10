const express = require('express')
<<<<<<< HEAD
=======
// const session = require('express-session')
// const { checkUserRole } = require('./databaseHandler')
// const { requiresLogin } = require('./projectLibrary')

>>>>>>> 57d6176b394089d572cbec183b033d3d692bf8a9
const app = express()

app.set('view engine', 'hbs')

<<<<<<< HEAD
app.get('/', (req, res) => {
    res.render('index')
})

const port = 3000
app.listen(port, () => {
    console.log('Server is running at ' + port)
})
=======
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('login')
})
app.get('/login', (req, res) => {
    res.render('login')
})



app.use(express.urlencoded({ extended: true }))
const PORT = process.env.PORT || 5123
app.listen(PORT)
console.log("Server is running! " + PORT)
>>>>>>> 57d6176b394089d572cbec183b033d3d692bf8a9
