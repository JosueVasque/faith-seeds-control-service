const express = require('express')
const router = express.Router({ mergeParams: true })
const c = require('../controllers/attendance.controller')

router.get('/', c.get)
router.post('/', c.upsert)

module.exports = router
