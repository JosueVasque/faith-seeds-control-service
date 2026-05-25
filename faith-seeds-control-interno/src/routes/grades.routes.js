const express = require('express')
const router = express.Router({ mergeParams: true })
const c = require('../controllers/grades.controller')

router.get('/', c.get)
router.put('/', c.update)

module.exports = router
