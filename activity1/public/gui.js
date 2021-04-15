/**
 * File: gui.js
 * SER 421
 * Lab 5
 *
 * This file implements a Javascript-based SPA for accessing a currency converter API
 * as specified in activity 1.
 *
 * Functions are:
 *    startup()
 *    login()
 *    comment()
 *    idle()
 *    isJson(string)
 */
/* global variables */
let convertForm = '<input type = "text" name = "dollars" id = "dollars" placeholder = "Enter in USD" onkeyup="checkText()">' +
                  '<button name = "euro" id = "euro" onclick="postToServer(0)" disabled>Euro</button>' +
                  '<button name = "pound" id = "pound" onclick="postToServer(1)" disabled>Pound</button>' +
                  '<button name = "pop" id = "pop" onclick="ajaxResult(\'http://localhost:8008/pop\', \'pop\')">Pop</button>' +
                  '<button name = "reset" id = "reset" onclick="resetHistory()">Reset</button>' +
                  '<button name = "history" id = "history" onclick="showHistory()">History</button>'

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
  document.getElementById('conversionHtml').innerHTML = '';
  document.getElementById('dollarsHtml').innerHTML = convertForm;
  showHistory();
}

function checkText(){
  if(!isNaN(document.getElementById('dollars').value)) {
    document.getElementById('euro').disabled = document.getElementById('dollars').value.length <= 0;
    document.getElementById('pound').disabled = document.getElementById('dollars').value.length <= 0;
  }
}

function getRequestObject() {
  if (window.XMLHttpRequest) {
    return(new XMLHttpRequest());
  } else {
    return (null);
  }
}

function ajaxResult(address, resultRegion) {
  const req = getRequestObject();
  req.onreadystatechange =
      function() { showResponseText(req,
          resultRegion); };
  req.open("GET", address, true);
  req.send(null);
}

function showResponseText(req, resultRegion) {
  if ((req.readyState === 4) &&
      (req.status === 200)) {
    if(resultRegion === 'historyHtml'){
      let resJson = JSON.parse(req.responseText);
      let resHtml = '';
      for(let i in resJson.history){
        resHtml += '<li>Operand: ' + JSON.stringify(resJson.history[i].dollars) + ' was converted to ' + parseInt(resJson.history[i].dollars) * 0.9 + ' ' +
            resJson.history[i].currency + ' IP: ' + resJson.history[i].ip + ' User-Details: ' + resJson.history[i].agent + '</li><br>';
      }
      document.getElementById(resultRegion).innerHTML = resHtml;
    }
    else if(resultRegion === 'pop'){
      let popJson = JSON.parse(req.responseText).pop;
      document.getElementById('conversionHtml').innerHTML = '<p>Currency Value is: ' +
          popJson.value.toFixed(2) + ' in ' + popJson.currency;
      document.getElementById('dollars').value = popJson.dollars;
      ajaxResult('http://localhost:8008/history', 'historyHtml');
      console.log(popJson)
    }
    //{"pop": "Operand: 50 was converted to 45 Euro IP: ::ffff:127.0.0.1 User-Details: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0"}
  }
}

function postToServer(currency) {
  let dollars = document.getElementById('dollars').value;
  let req = new XMLHttpRequest();
  if(currency === 0) {
    req.open('POST', 'http://localhost:8008/euro');
  }
  else if (currency === 1) {
    req.open('POST', 'http://localhost:8008/pound');
  }
  req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  req.onreadystatechange = function() {
    if ( req.readyState === 4 ) {
      console.log('State: ' + req.readyState);
      if ( req.status === 200 ) {
        let resJson = JSON.parse(req.responseText);
        document.getElementById('conversionHtml').innerHTML = '<p>Currency Value is: ' +
            resJson.value.toFixed(2) + ' in ' + resJson.currency;
        ajaxResult('http://localhost:8008/history', 'historyHtml');
      } else { // handle request failure
        document.getElementById("conversionHtml").innerHTML = "Error retrieving response from server";
      }
    }
  }
  req.send(JSON.stringify({dollars: parseInt(dollars)}));
  return req;
}

function convertToPound(){

}

function popStack(){

}

function resetHistory(){

}

function showHistory(){

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