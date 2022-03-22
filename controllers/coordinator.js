const express = require('express')
const { requireCoordinator } = require('../projectLibrary')

const router = express.Router()

router.get('/', requireCoordinator, (req, res) => {
    res.render('coordinator/index')
})

module.exports = router