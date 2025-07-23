var express = require('express');
var router = express.Router();

/* GET almafa */
router.get('/', function(req, res, next) {
  res.json('almafa');
});

module.exports = router;
