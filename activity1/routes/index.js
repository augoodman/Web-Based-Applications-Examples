/**
 * File: index.js
 * SER 421
 * Lab 3
 *
 * This file implements a Javascript-based article review service as specified in Activity 1.
 *
 * Functions are:
 *    reset()
 *    update(action, req)
 *    add(req)
 *    del(req)
 *    readFile()
 *    writeFile(comments)
 */
/* imports */
const express = require('express');
const router = express.Router();
const fs = require('fs');
/* global variables */
const file = './comments.json';
const article = fs.readFileSync('article.txt', 'UTF-8');
const lines = article.split(/\r?\n/);
let comments = [];
let activities = [];
let result = '';
let title = '';
let body = '';
/* functions */
/*******************************************************************************************
 * reset() - Resets all comments and user actions on the article.
 *
 * arguments:
 *   none
 *
 * returns:
 *   nothing
 */
const reset = function () {
  activities = [];
  writeFile([]);
  result = 'User activities and comments reset.';
  console.log('User activities and comments reset.');
};

/*******************************************************************************************
 * update(action, req) - Updates the stacks whenever a user adds or deletes a comment.
 *
 * arguments:
 *   string - sets the user action type.
 *
 * returns:
 *   nothing
 */
const update = function (action, req) {
  if (action === 'add') {
    activities.push('add,' + req.body.id + ',' + req.body.comment + ',' + req.get('user-agent'));
  } else if (action === 'del') {
    let comment = '';
    for(let i in comments){
      if(parseInt(comments[i].id) === parseInt(req.body.id)){
        comment = comments[i].comment;
      }
    }
    activities.push('delete,' + req.body.id + ',' + comment + ',' + req.get('user-agent'));
  } else if (action === 'undo') {
    if(activities.length > 0) {
      let undo = activities.pop().split(',');
      if (undo[0] === 'add') {
        for (let i in comments) {
          if (parseInt(comments[i].id) === parseInt(undo[1])) {
            comments.splice(i, 1);
            writeFile(comments);
            return;
          }
        }
      } else if (undo[0] === 'delete') {
        comments.push({'id': undo[1], 'comment': undo[2]});
        writeFile(comments);
      }
    }
  }
  console.log('User activities updated.');
};

/*******************************************************************************************
 * add(req) - Adds a comment to the article.
 *
 * arguments:
 *   Object - contains request data.
 *
 * returns:
 *   nothing
 */
const add = function (req) {
  for (let i in comments) {
    if (comments[i].id === req.body.id) {
      result = 'Comment with given ID already exists.';
      console.log('Comment with given ID already exists.');
      return;
    }
  }
  update('add', req);
  comments.push({'id': req.body.id, 'comment': req.body.comment});
  writeFile(comments);
  result = 'Comment added.';
  console.log('Comment added.');
};

/*******************************************************************************************
 * del(req) - Deletes a comment from the article.
 *
 * arguments:
 *   Object - contains request data.
 *
 * returns:
 *   nothing
 */
const del = function (req) {
  for (let i in comments) {
    if (parseInt(comments[i].id) === parseInt(req.body.id)) {
      update('del', req);
      comments.splice(i, 1);
      writeFile(comments);
      result = 'Comment deleted.';
      console.log('Comment deleted.');
      return;
    }
  }
  result = 'Comment with given ID does not exist.';
  console.log('Comment with given ID does not exist.');
};

/*******************************************************************************************
 * readFile() - Helper function for reading data from comments.json
 *
 * arguments:
 *   none
 *
 * returns:
 *   nothing
 */
function readFile(){
  let jsonString = fs.readFileSync(file, 'utf8')
  comments = JSON.parse(jsonString)
  console.log("Read from file.")
}

/*******************************************************************************************
 * writeFile(comments) - Helper function for writing data to comments.json
 *
 * arguments:
 *   JSON Object - contains the data to be written to file.
 *
 * returns:
 *   nothing
 */
function writeFile(comments){
  fs.writeFileSync(file, JSON.stringify(comments))
  console.log("Wrote to file.")
}

/* GET home page. */
router.get('/', function(req, res, next) {
  readFile();
  if(comments[0] === null){
    comments = [];
  }
  if(body === ''){
    for (let i = 0; i < lines.length; i++) {
      if (i === 0) {
        title = lines[i];
      } else {
        body += lines[i];
      }
    }
  }
  res.set('Cache-Control', 'no-cache');
  res.render('index', {
    title: title,
    article: body,
    numComments: comments.length,
    comments: comments,
    result: result
  });
  result = '';
});

/* GET view page. */
router.get('/view', function(req, res, next) {
  res.set('Cache-Control', 'no-cache');
  res.render('view', {
    title: 'View User Activity',
    activities: activities,
  });
});

/* GET reset page. */
router.get('/reset', function(req, res, next) {
  reset();
  res.redirect('/')
});

/* GET undo page. */
router.get('/undo', function(req, res, next) {
  update('undo', req);
  res.redirect('/')
});

/* POST add page. */
router.post('/add', function(req, res, next) {
  add(req);
  res.redirect('/')
});

/* POST delete page. */
router.post('/delete', function(req, res, next) {
  del(req);
  res.redirect('/')
});

module.exports = router;
