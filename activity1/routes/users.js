var express = require('express');
var router = express.Router();

/* GET view listing. */
router.get('/users', function(req, res, next) {
  res.render('view', {

  });
});

module.exports = router;
