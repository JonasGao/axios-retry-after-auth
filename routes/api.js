var express = require('express')
var router = express.Router()

/* GET users listing. */
router.post('/a', function (req, res, next) {
  res.json({code: req.session.valid ? 1 : 0, message: 'Hello, A'})
})

router.post('/b', function (req, res, next) {
  res.json({code: req.session.valid ? 1 : 0, message: 'Hello, B'})
})

router.post('/c', function (req, res, next) {
  req.session.valid = true
  res.json({code: 1})
})

module.exports = router
