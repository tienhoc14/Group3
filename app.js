const express = require('express')
const app = express()

app.set('view engine', 'hbs')

app.get('/', (req, res) => {
    res.render('index')
})

const port = 3000
app.listen(port, () => {
    console.log('Server is running at ' + port)
})