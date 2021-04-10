const session = {'username': undefined, 'status': false};
let timer = {};
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
    alert('Welcome back ' + username + "!");
  }
}

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
}

function comment(){
  window.clearTimeout(timer);
  timer = idle();
  let lastWord = '';
  let comment = document.getElementById('comment').value;
  if(comment.startsWith('{') || comment.endsWith('}')){
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
  let commentWords = comment.replace(/[^a-zA-Z -]/g, '').split(' ');
  let newComment = '';
  for(let i in dictionary.entries){
    let numAnswers = dictionary.entries[i].answer.length;
    for(let j in dictionary.entries[i].key){
      for(let k in commentWords){
        if(commentWords[k] === dictionary.entries[i].key[j]){
          commentWords[k] = dictionary.entries[i].answer[Math.floor((Math.random() * numAnswers))];
          while(lastWord === commentWords[k]){
            commentWords[k] = dictionary.entries[i].answer[Math.floor((Math.random() * numAnswers))];
          }
          lastWord = commentWords[k];
        }
      }
    }
  }
  for(let i in commentWords){
    newComment += commentWords[i] + ' ';
  }
  document.getElementById('comment').value = newComment;
}

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

function isJson(string){
  try{
    JSON.parse(string);
  }catch (e){
    return false;
  }
  return true;
}