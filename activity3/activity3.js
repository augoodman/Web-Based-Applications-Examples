/**
 * File: activity3.js
 * SER 421
 * Lab 4
 *
 * This file implements a Javascript-based roommate finder service as specified in
 * Activity 3.
 *
 * Functions are:
 *    startup()
 *    login()
 *    comment()
 *    idle()
 *    isJson(string)
 *    command(comment)
 *    clearCookies()
 */
/* global variables */
const session = {'username': undefined, 'status': false};
let timer = {};
let searchHistory = [];
let dictionary = {
  "dictionary_name": "default",
  "entries":
      [{
        "key": ["stupid", "dumb", "idiot", "unintelligent", "simple-minded", "braindead", "foolish", "unthoughtful"],
        "answer": ["educated", "informed", "schooled"]
      }, {
        "key": ["unattractive", "hideous", "ugly"],
        "answer": ["attractive", "beauteous", "beautiful", "lovely", "pretty", "ravishing"]
      }, {
        "key": ["ambiguous", "cryptic", "dark", "nebulous", "obscure", "unintelligible"],
        "answer": ["obvious", "plain", "unambiguous", "understandable", "unequivocal"]
      }, {
        "key": ["incapable", "incompetent", "inept", "unable", "unfit", "unqualified", "weak", "artless"],
        "answer": ["accomplished", "fit", "adept", "complete", "consummate"]
      }, {
        "key": ["emotionless", "heartless", "unkind", "mean", "selfish", "evil"],
        "answer": ["benevolent", "benignant", "gentle", "kind", "clement"]
      }, {
        "key": ["idle"],
        "answer": ["Can you reply something?", "You have been idle for more than 30 seconds", "Whats the matter with you? Submit something"]
      }]
};
let workingCopy = dictionary;
let reviewTitle = "LEGO 45";
let reviewBody = "This is going to be a tremendous review. No one has ever seen a review this great. It's about a " +
    "great man, a genius really. And he's in a world make of these little plastic bricks. I think they call them " +
    "Legos. And so, this man, this stable genius goes around the world building hotels and golfing.  He totally " +
    "saves America, by the way. But there he is golfing and it shows his little plastic Lego hands which is " +
    "completely fake news, okay? He actually has the best-sized hands. But he's going around golfing and, anyways, " +
    "he saves the country, okay? Can you believe that? But like I said, this was a fantastic review and trust me, I " +
    "know the greatest reviewers. Believe me. They all say this really is the best review. - Don";
let loginForm = '<input type="text" name="username" id="username" placeholder="Enter your name">' +
  '<input type="button" name="login" value="Login" onclick="login()">';
let review = [
  '<p>Please Sign-in</p>',
  '<h1>Welcome ' + session.username + ' to Rated-G Movie Reviews</h1>' +
  '<h3>' + reviewTitle + '</h3>' +
  '<p>' + reviewBody + '</p>'
];
let commentForm = '<textarea id="comment" rows="4" cols="30" placeholder="Please enter a comment"></textarea>' +
    '<br><input type="button" name="comment" value="Comment" onclick="comment()">';
/* functions */
/*******************************************************************************************
 * startup() - Takes user to initial state. Varies if user cookies are found.
 *
 * arguments:
 *   none
 *
 * returns:
 *   nothing
 */
function startup(){
  if(session.status === false) {
    document.getElementById('login_form').innerHTML = loginForm;
    document.getElementById('review').innerHTML = review[0];
  }
  if(document.cookie !== ''){
    window.clearTimeout(timer);
    timer = idle();
    let username = document.cookie.split('; ').find(row => row.startsWith('username')).split('=')[1];
    review = [
      '<p>Please Sign-in</p>',
      '<h1>Welcome ' + username + ' to Rated-G Movie Reviews</h1>' +
      '<h3>' + reviewTitle + '</h3>' +
      '<p>' + reviewBody + '</p>'
    ];
    document.getElementById('review').innerHTML = review[1];
    document.getElementById('comment_form').innerHTML = commentForm;
    document.getElementById('comment').value = localStorage.getItem(session.username);
    alert('Welcome back ' + username + "!");
  }
}

/*******************************************************************************************
 * login() - Logins for a given username.
 *
 * arguments:
 *   none
 *
 * returns:
 *   nothing
 */
function login(){
  window.clearTimeout(timer);
  timer = idle();
  session.username = document.getElementById('username').value;
  session.status = true;
  document.cookie = 'username=' + session.username + ';SameSite=Strict';
  review = [
    '<p>Please Sign-in</p>',
    '<h1>Welcome ' + session.username + ' to Rated-G Movie Reviews</h1>' +
    '<h3>' + reviewTitle + '</h3>' +
    '<p>' + reviewBody + '</p>'
  ];
  document.getElementById('review').innerHTML = review[1];
  document.getElementById('comment_form').innerHTML = commentForm;
  document.getElementById('comment').value = localStorage.getItem(session.username);
}

/*******************************************************************************************
 * comment() - Parses user comments, JSON updates, and commands and takes appropriate
 * actions.
 *
 * arguments:
 *   none
 *
 * returns:
 *   nothing
 */
function comment(){
  window.clearTimeout(timer);
  timer = idle();
  let lastWord = '';
  let comment = document.getElementById('comment').value;
  if(comment.startsWith('/')){  //check if comment is a command
    command(comment);
    return;
  }
  if(comment.startsWith('{') || comment.endsWith('}')){ //check if comment is a JSON update
    if(isJson(comment)){
      let jsonComment = JSON.parse(comment);
      let key = Object.keys(jsonComment)[0];
      for(let i in dictionary.entries){
        if(dictionary.entries[i].key.indexOf(key) > -1){
          dictionary.entries[i].key.push(jsonComment[key]);
          alert('Word added to the dictionary and the dictionary is smarter.');
          return;
        }
      }
      alert('Could not find the proper key and the dictionary stays dumb.');
      return;
    }
    else{
      alert("Invalid JSON! Please enter a valid JSON!");
    }
  }
  let commentWords = comment.replace(/[^a-zA-Z -]/g, '').split(' '); //strip non-letters out of comment
  let newComment = '';
  let count;
  if(sessionStorage.getItem('reviews') === null){ //store uncensored reviews
    let reviews = {'uncensored':[], 'censored':[]};
    reviews.uncensored.push(commentWords);
    sessionStorage.setItem('reviews', JSON.stringify(reviews));
  }
  else{
    let reviews = JSON.parse(sessionStorage.getItem('reviews'));
    reviews.uncensored.push(commentWords);
    sessionStorage.setItem('reviews', JSON.stringify(reviews));
  }
  for(let i in dictionary.entries){ //search dictionary and censor comment as appropriate
    let numAnswers = dictionary.entries[i].answer.length;
    for(let j in dictionary.entries[i].key){
      for(let k in commentWords){
        if(commentWords[k] === dictionary.entries[i].key[j]){
          commentWords[k] = dictionary.entries[i].answer[Math.floor((Math.random() * numAnswers))];
          while(lastWord === commentWords[k]){
            commentWords[k] = dictionary.entries[i].answer[Math.floor((Math.random() * numAnswers))];
          }
          lastWord = commentWords[k];
          count++;
          sessionStorage.setItem(session.username, count.toString());
        }
      }
    }
  }
  for(let i in commentWords){ //build censored comment string
    newComment += commentWords[i] + ' ';
  }
  let reviews = JSON.parse(sessionStorage.getItem('reviews'));
  reviews.censored.push(commentWords);
  sessionStorage.setItem('reviews', JSON.stringify(reviews)); //store censored reviews
  document.getElementById('comment').value = newComment;
  localStorage.setItem(session.username, newComment); //make stateful by storing user's last comment
}

/*******************************************************************************************
 * idle() - Alerts user to inactivity after 30 seconds since last action.
 *
 * arguments:
 *   none
 *
 * returns:
 *   nothing
 */
function idle(){
  return window.setTimeout(function() {
    let message = '';
    for(let i in dictionary.entries){
      for(let j in dictionary.entries[i].key){
        if(dictionary.entries[i].key[j] === 'idle'){
          let numMessages = dictionary.entries[i].answer.length;
          message = dictionary.entries[i].answer[Math.floor((Math.random() * numMessages))];
        }
      }
    }
    alert(message);
  }, 30000);
}

/*******************************************************************************************
 * isJson(string)() - Alerts user to inactivity after 30 seconds since last action.
 *
 * arguments:
 *   string - data to be validated/invalidated as JSON
 *
 * returns:
 *   boolean - JSON status
 */
function isJson(string){
  try{
    JSON.parse(string);
  }catch (e){
    return false;
  }
  return true;
}

/*******************************************************************************************
 * command(comment) - Parses commands and takes appropriate action.
 *
 * arguments:
 *   string - command to be executed
 *
 * returns:
 *   nothing
 */
function command(comment){
  let command = comment.substring(1); //strip leading '/'
  if(command === 'clear'){  //execute clear command by clearing all storage and resetting DOM elements
    clearCookies();
    localStorage.clear();
    sessionStorage.clear();
    session.status = false;
    document.getElementById('comment_form').innerHTML = '';
    document.getElementById('history').innerHTML = '';
    document.getElementById('reviews').innerHTML = '';
    startup();
  }
  if(command.indexOf('search') !== -1){ //parse search value and execute search
    let value = [];
    let results = [];
    let resultString = '';
    value = comment.split(' ');
    searchHistory.push(value[1]);
    for(let i in dictionary.entries){
      for(let j in dictionary.entries[i].key){
        if(value[1] === dictionary.entries[i].key[j]){
          for(let l in dictionary.entries[i].answer) {
            results.push(dictionary.entries[i].answer[l]);
          }
        }
      }
    }
    for(let i = 0; i < results.length; i++){
      if(i < results.length - 1) {
        resultString += results[i] + ', ';
      }
      else{
        resultString += results[i];
      }
    }
    document.getElementById('comment').value = resultString;
  }
  if(command === 'history'){  //execute history command by inserting ordered list of search terms into the DOM
    let history = '<ol>';
    for(let i in searchHistory){
      history += '<li>' + searchHistory[i] + '</li>';
    }
    history += '</ol>';
    document.getElementById('history').innerHTML = history;
  }
  if(command === 'count'){  //execute count command by displaying numbers of censored words
    if(sessionStorage.getItem(session.username) === null){
      alert('You need to submit a comment before you can get a count');
      return;
    }
    document.getElementById('comment').value = 'Number of rude words used is ' + sessionStorage.getItem(session.username);
  }
  if(command === 'list'){ //execute list command by parsing sessionStorage into JSON and inserting review lists into the DOM
    if(sessionStorage.getItem('reviews') === null){
      alert('You need to submit a review before you can get a list of reviews');
      return;
    }
    let reviewString = 'List of reviews:<br>';
    let uncensored = JSON.parse(sessionStorage.getItem('reviews')).uncensored;
    for(let i in uncensored){
      reviewString += '<li>' + uncensored[i] + '</li>';
    }
    reviewString += '<br>List of censored reviews:<br>';
    let censored = JSON.parse(sessionStorage.getItem('reviews')).censored;
    for(let i in censored){
      reviewString += '<li>' + censored[i] + '</li>';
    }
    document.getElementById('reviews').innerHTML = reviewString;
  }
}

/*******************************************************************************************
 * clearCookies - Clears user cookies.
 *
 * arguments:
 *   string - command to be executed
 *
 * returns:
 *   nothing
 */
function clearCookies(){
  let cookies = document.cookie.split(';');
  for(let i in cookies){
    document.cookie = cookies[i] + "=;expires=" + new Date(0).toUTCString();
  }
}