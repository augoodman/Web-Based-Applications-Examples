var express = require('express');
var router = express.Router();
var fs = require('fs');
const article = fs.readFileSync('articles/article.txt', 'UTF-8');
const lines = article.split(/\r?\n/);
var title = '';
var body = '';
var comments = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  for (let i = 0; i < lines.length; i++) {
    if (i === 0) {
      title = lines[i];
    } else {
      body += lines[i];
    }
  }
  res.render('index', {
    title: title,
    article: body,
    numComments: comments.length,
    comments: comments
  });
});

module.exports = router;
