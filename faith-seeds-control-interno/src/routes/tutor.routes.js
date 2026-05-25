const express = require('express')
const router = express.Router()
const c = require('../controllers/tutor.controller')

router.get('/', c.getTutors)
router.get('/:id', c.getTutor)
router.post('/', c.createTutor)
router.put('/:id', c.updateTutor)
router.delete('/:id', c.deleteTutor)

module.exports = router
