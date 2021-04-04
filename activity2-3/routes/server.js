/**
 * File: server.js
 * SER 421
 * Lab 3
 *
 * This file implements a Javascript-based roommate finder service as specified in
 * Activities 2 and 3.
 *
 * Functions are:
 *    login(username)
 *    adminLogin(username, password)
 *    readFile(file)
 *    writeFile(file, data)
 */
/* imports */
const express = require('express');
const router = express.Router();
const session = require('express-session');
const fs = require('fs');
/* global variables */
const questionsJson = './questions.json';
const usersJson = './users.json';
let result = '';
let questions = [];
let users = {};
let numOptions = 2;
let questionAdded = false;
let newQuestion = {};
let nextID = 0;
/* functions */
/*******************************************************************************************
 * login(username) - Logins for a given username if the user exists and creates an account
 * logs into it if not.
 *
 * arguments:
 *   string - username of account to log into or create.
 *
 * returns:
 *   nothing
 */
const login = function(username) {
  readFile(usersJson);
  session.questionID = 1;
  session.preference = true;
  session.responses = [];
  for(let i in users){
    if(users[i].user === username){
      session.user = username;
      session.status = 'active';
      console.log('Logged in.');
      return;
    }
  }
  session.user = username;
  users.push({'user': username, 'responses': []});
  writeFile(usersJson, users);
  console.log('New user created.');
};

/*******************************************************************************************
 * adminLogin(username, password) - Logins into an admin account with the correct
 * credentials
 *
 * arguments:
 *   string - username of admin account to log into.
 *   string - password of admin account to log into.
 *
 * returns:
 *   nothing
 */
const adminLogin = function(username, password){
  if(username === password){
    session.user = username;
    session.admin = true;
    console.log('Logged in as admin.');
    return;
  }
  session.admin = false;
}

/*******************************************************************************************
 * readFile(file) - Helper function for reading data from questions.json
 *
 * arguments:
 *   string - name of the file to be written to.
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
 * writeFile(file, data) - Helper function for writing data to comments.json
 *
 * arguments:
 *   string - name of the file to be written to.
 *   JSON Object - contains the data to be written to file.
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

/* GET home page. */
router.get('/', function(req, res, next) {
  session.admin = false;
  session.authenticated = true;
  readFile(questionsJson);
  nextID = questions.length + 1;
  res.set('Cache-Control', 'no-cache');
  res.render('index', { title: 'Login' });
});

/* POST home page. */
router.post('/', function(req, res, next) {
  session.status = 'inactive';
  if(req.body.admin_login){
    res.set('Cache-Control', 'no-cache');
    res.redirect('/admin');
  }
  if(req.body.login){
    login(req.body.username);
    res.set('Cache-Control', 'no-cache');
    res.redirect('/question/' + session.questionID);
  }
  if(req.body.home){
    res.set('Cache-Control', 'no-cache');
    res.redirect('/');
  }
});

/* GET question page. */
router.get('/question/:id', function(req, res, next) {
  if(session.status !== 'active'){
    res.redirect('/');
  }
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
  if(req.body.preference === 'Vertical'){
    session.preference = true;
    res.redirect('/question/' + session.questionID);
  }
  else if(req.body.preference === 'Horizontal'){
    session.preference = false;
    res.redirect('/question/' + session.questionID);
  }
});

/* GET matches page. */
router.get('/matches', function(req, res, next) {
  if(session.status !== 'active'){
    res.set('Cache-Control', 'no-cache');
    res.redirect('/');
  }
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
      matchStrength.push((i / questions.length).toFixed(1) * 100);
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

/* GET admin page. */
router.get('/admin', function(req, res, next) {
  res.set('Cache-Control', 'no-cache');
  res.render('admin', {
    title: 'Admin',
    authenticated: session.authenticated
  });
});

/* POST admin page. */
router.post('/admin', function(req, res, next) {
  if(req.body.login){
    adminLogin(req.body.username, req.body.password);
    if(session.admin){
      session.authenticated = true;
      res.redirect('/manage_survey');
    }
    else{
      session.authenticated = false;
      res.redirect('/admin');
    }
  }
});

/* GET manage survey page. */
router.get('/manage_survey', function(req, res, next) {
  if(session.admin !== true){
    res.redirect('/');
  }
  readFile(questionsJson);
  res.set('Cache-Control', 'no-cache');
  res.render('manage_survey', {
    title: 'Add Questions',
    numOptions: numOptions,
    questionAdded: questionAdded
  });
});

/* POST manage survey page. */
router.post('/manage_survey', function(req, res, next) {
  if(req.body.add){
    if(numOptions < 10) {
      numOptions++;
    }
    res.redirect('/manage_survey');
  }
  if(req.body.remove){
    if(numOptions >= 3) {
      numOptions--;
    }
    res.redirect('/manage_survey');
  }
  if(req.body.question){
    questionAdded = true;
    newQuestion['id'] = nextID;
    newQuestion['question'] = req.body.question[0];
    newQuestion['options'] = {};
    for(let i = 0; i < req.body.option.length; i++) {
      newQuestion['options']['option' + (i + 1)] = req.body.option[i];
    }
    questions.push(newQuestion);
    writeFile(questionsJson, questions);
    nextID++;
    res.redirect('/manage_survey');
  }
});

module.exports = router;