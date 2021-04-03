const express = require('express');
const router = express.Router();
const session = require('express-session');
session.question = 1;
session.preference = true;
session.responses = [];
const fs = require('fs');
const file = './questions.json';
let result = '';
let questions = [];

const login = function (username) {
  session.username = username;
  console.log('Logged in.')
};

/* GET home page. */
router.get('/', function(req, res, next) {
  readFile();
  res.set('Cache-Control', 'no-cache');
  res.render('index', { title: 'Login' });
});

router.post('/', function(req, res, next) {
  login(req.body.username);
  res.set('Cache-Control', 'no-cache');
  res.redirect('/question/' + session.question);
});

/* GET question page. */
router.get('/question/:id', function(req, res, next) {
  let question = {};
  for(let i in questions){
    if(parseInt(questions[i].id) === parseInt(req.params.id)){
      question = questions[i];
    }
  }
  let options = [];
  for(let i in question.options){
    if(question.options.hasOwnProperty(i)){
      let value = question.options[i];
      options.push(value);
    }
  }
  res.set('Cache-Control', 'no-cache');
  res.render('question', {
    title: 'Question ' + req.params.id,
    id: question.id,
    next: parseInt(question.id) + 1,
    prev: parseInt(question.id) - 1,
    size: questions.length,
    question: question.question,
    options: options,
    preference: session.preference,
    result: result
  });
});

/* POST question page. */
router.post('/question/', function(req, res, next) {
  session.responses[session.question] = req.body.response;
  console.log(req.body)
  if(req.body.next){
    session.question++;
    res.redirect('/question/' + session.question);
  }
  else if(req.body.prev){
    session.question--;
    res.redirect('/question/' + session.question);
  }
  if(req.body.vertical){
    session.preference = true;
    res.redirect('/question/' + session.question);
  }
  if(req.body.horizontal){
    session.preference = false;
    res.redirect('/question/' + session.question);
  }
});

/*******************************************************************************************
 * readFile() - Helper function for reading data from questions.json
 *
 * arguments:
 *   none
 *
 * returns:
 *   nothing
 */
function readFile(){
  let jsonString = fs.readFileSync(file, 'utf8')
  questions = JSON.parse(jsonString)
  console.log("Read from file.")
}

/*******************************************************************************************
 * readFile() - Helper function for writing data to questions.json
 *
 * arguments:
 *   none
 *
 * returns:
 *   nothing
 */
function writeFile(questions){
  fs.writeFileSync(file, JSON.stringify(questions))
  console.log("Wrote to file.")
}

module.exports = router;
