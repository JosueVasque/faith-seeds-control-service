const express = require('express')
const router = express.Router({ mergeParams: true })
const c = require('../controllers/paperwork.controller')

router.get('/', c.get)
router.put('/', c.update)

module.exports = router
