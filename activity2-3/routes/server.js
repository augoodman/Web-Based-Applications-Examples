const express = require('express');
const router = express.Router();
const session = require('express-session');
const fs = require('fs');
const questionsJson = './questions.json';
const usersJson = './users.json';
let result = '';
let questions = [];
let users = {};

const login = function(username) {
  readFile(usersJson);
  session.questionID = 1;
  session.preference = true;
  session.responses = [];
  for(let i in users){
    if(users[i].user === username){
      session.user = username;
      console.log('Logged in.');
      return;
    }
  }
  session.user = username;
  users.push({'user': username, 'responses': []});
  writeFile(usersJson, users);
  console.log('New user created.');
};

const oneShotTimer = function(res) {
  console.log('30 timer started.');
  setTimeout(function() {
    res.set('Cache-Control', 'no-cache');
    res.redirect('/question/' + session.questionID);
  }, 30000);
}

async function terminateSurvey(res){
  return await oneShotTimer(res);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  readFile(questionsJson);
  res.set('Cache-Control', 'no-cache');
  res.render('index', { title: 'Login' });
});

/* POST home page. */
router.post('/', function(req, res, next) {
  login(req.body.username);
  //terminateSurvey(res);
  res.set('Cache-Control', 'no-cache');
  res.redirect('/question/' + session.questionID);
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
  let response = session.responses[req.params.id];
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
    result: result,
    response: response
  });
});

/* POST question page. */
router.post('/question', function(req, res, next) {
  session.responses[session.questionID] = req.body.response;
  users[session.user] = {'user': session.user, 'responses': session.responses};
  for(let i in users){
    if(session.user === users[i].user){
      users[i].responses = session.responses;
      writeFile(usersJson, users);
    }
  }
  if(req.body.next){
    session.questionID++;
    res.redirect('/question/' + session.questionID);
  }
  else if(req.body.prev){
    session.questionID--;
    res.redirect('/question/' + session.questionID);
  }
  else if(req.body.finish){
    session.questionID++;
    res.redirect('/matches');
  }
  if(req.body.vertical){
    session.preference = true;
    res.redirect('/question/' + session.questionID);
  }
  if(req.body.horizontal){
    session.preference = false;
    res.redirect('/question/' + session.questionID);
  }
});

/* GET matches page. */
router.get('/matches', function(req, res, next) {
  let matches = {};
  for(let i in users){
    for(let j in session.responses){
      if(users[i].user !== session.user){
        if(users[i].responses[j] === session.responses[j] && session.responses[j] !== null){
          if(!matches[users[i].user]) {
            matches[users[i].user] = 1;
          }
          else{
            matches[users[i].user]++;
          }
        }
      }
    }
  }
  let matchStrength = [];
  for(let i = questions.length; i > 0; i--){
    if(i !== 0) {
      matchStrength.push((i / questions.length) * 100);
    }
  }
  res.set('Cache-Control', 'no-cache');
  res.render('matches', {
    title: 'Your Matches',
    size: matchStrength.length,
    matches: matches,
    matchStrength: matchStrength
  });
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
function readFile(file){
  let jsonString = fs.readFileSync(file, 'utf8')
  if(file === './questions.json') {
    questions = JSON.parse(jsonString);
  }
  else if (file === './users.json'){
    users = JSON.parse(jsonString);
  }
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
function writeFile(file, data){
  if(file === './questions.json') {
    fs.writeFileSync(questionsJson, JSON.stringify(data, null, 4))
  }
  else if (file === './users.json'){
    fs.writeFileSync(usersJson, JSON.stringify(data, null, 4))
  }
  console.log("Wrote to file.")
}

module.exports = router;
