var express = require('express');
var router = express.Router();
var fs = require('fs');
const article = fs.readFileSync('articles/article.txt', 'UTF-8');
const lines = article.split(/\r?\n/);
var comments = [{'id': 1, 'comment': 'first'}, {'id': 69, 'comment': 'hello'}];
var activities = ['test1','test2','test3'];
var title = '';
var body = '';

var reset = function(){
  activities = []
  console.log('User activities reset.')
}

var add = function(id, comment) {
  //add handling for duplicate id values
  if(!('id' in comments)) {
    comments.push({'id': id, 'comment': comment});
  }
}

var del = function(id) {
  //add handling for key !exist
  delete comments[id];
}

/* GET home page. */
router.get('/', function(req, res, next) {
  if(body === ''){
    for (let i = 0; i < lines.length; i++) {
      if (i === 0) {
        title = lines[i];
      } else {
        body += lines[i];
      }
    }
  }
  res.render('index', {
    title: title,
    article: body,
    numComments: comments.length,
    comments: comments
  });
});

/* GET view page. */
router.get('/view', function(req, res, next) {
  res.render('view', {
    title: 'View User Activity',
    activities: activities,
  });
});

router.get('/reset', function(req, res, next) {
  reset();
  res.render('index', {
    title: title,
    article: body,
    numComments: comments.length,
    comments: comments
  });
});

router.post('/add', function(req, res, next) {
  add(req.body.id, req.body.comment);
  res.render('index', {
    title: title,
    article: body,
    numComments: comments.length,
    comments: comments
  });
});

router.post('/delete', function(req, res, next) {
  del(req.body.id);
  res.render('index', {
    title: title,
    article: body,
    numComments: comments.length,
    comments: comments
  });
});

module.exports = router;
