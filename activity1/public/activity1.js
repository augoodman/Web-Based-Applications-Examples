/**
 * File: activity1.js
 * SER 421
 * Lab 5
 *
 * This file implements a Javascript-based SPA for accessing a currency converter API as
 * specified in activity 1.
 *
 * Functions are:
 *    startup()
 *    checkText()
 *    getRequestObject()
 *    ajaxResult(address, resultRegion)
 *    showResponseText(req, resultRegion)
 *    postToServer(currency)
 *    handleError(res)
 */
/* global variables */
let convertForm = '<input type = "text" name = "dollars" id = "dollars" placeholder = "Enter in USD" onkeyup="checkText()">' +
                  '<button name = "euro" id = "euro" onclick="postToServer(0)" disabled>Euro</button>' +
                  '<button name = "pound" id = "pound" onclick="postToServer(1)" disabled>Pound</button>' +
                  '<button name = "pop" id = "pop" onclick="ajaxResult(\'http://localhost:8008/pop\', \'pop\')">Pop</button>' +
                  '<button name = "reset" id = "reset" onclick="ajaxResult(\'http://localhost:8008/reset\', \'reset\')">Reset</button>' +
                  '<button name = "history" id = "history" onclick="ajaxResult(\'http://localhost:8008/history\', \'historyHtml\')">History</button>'

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
  ajaxResult('http://localhost:8008/history', 'historyHtml');
}

/*******************************************************************************************
 * checkText() - Disables Euro and Pound buttons if text box is empty or NaN.
 *
 * arguments:
 *   none
 *
 * returns:
 *   nothing
 */
function checkText(){
  if(!isNaN(document.getElementById('dollars').value)) {
    document.getElementById('euro').disabled = document.getElementById('dollars').value.length <= 0;
    document.getElementById('pound').disabled = document.getElementById('dollars').value.length <= 0;
  }
}

/*******************************************************************************************
 * getRequestObject() - Gets the XHR object if it exists.
 *
 * arguments:
 *   none
 *
 * returns:
 *   Object - The XHR object if it exists; returns null otherwise.
 */
function getRequestObject() {
  if (window.XMLHttpRequest) {
    return(new XMLHttpRequest());
  } else {
    return (null);
  }
}

/*******************************************************************************************
 * ajaxResult(address, resultRegion) - Handles AJAX GET requests.
 *
 * arguments:
 *   String - the URI for the desired API endpoint.
 *   String - describes the DOM element(s) to be updated.
 *
 * returns:
 *   nothing
 */
function ajaxResult(address, resultRegion) {
  const req = getRequestObject();
  req.onreadystatechange =
      function() { showResponseText(req,
          resultRegion); };
  req.open("GET", address, true);
  req.send(null);
}

/*******************************************************************************************
 * showResponseText(req, resultRegion) - Updates the DOM after AJAX GET request.
 *
 * arguments:
 *   Object - the request object containing the response.
 *   String - describes the DOM element(s) to be updated.
 *
 * returns:
 *   nothing
 */
function showResponseText(req, resultRegion) {
  if ((req.readyState === 4) &&
      (req.status === 200)) {
    if(resultRegion === 'historyHtml'){
      let resJson = JSON.parse(req.responseText);
      let resHtml = '';
      document.getElementById('reset').disabled = resJson.history.length === undefined;
      for(let i in resJson.history){
        resHtml += '<li>Operand: ' + JSON.stringify(resJson.history[i].dollars) + ' was converted to ' +
            resJson.history[i].value.toFixed(2) + ' ' + resJson.history[i].currency + ' IP: ' +
            resJson.history[i].ip + ' User-Details: ' + resJson.history[i].agent + '</li><br>';
      }
      document.getElementById(resultRegion).innerHTML = resHtml;
    }
    else if(resultRegion === 'pop'){
      if(req.responseText){
        let popJson = JSON.parse(req.responseText);
        if (popJson.pop !== undefined) {
          ajaxResult('http://localhost:8008/history', 'historyHtml');
          document.getElementById('conversionHtml').innerHTML = '<p>Currency Value is: ' +
              popJson.pop.value.toFixed(2) + ' in ' + popJson.pop.currency;
          document.getElementById('dollars').value = popJson.pop.dollars;
        }
        else {
          document.getElementById('conversionHtml').innerHTML = '';
          document.getElementById('dollars').value = '';
          document.getElementById('historyHtml').innerHTML = '';
        }
      }
    }
    else if(resultRegion === 'reset'){
      if(JSON.parse(req.responseText).reset){
        document.getElementById('conversionHtml').innerHTML = '';
        document.getElementById('dollars').value = '';
        document.getElementById('historyHtml').innerHTML = '';
      }
    }
  }
  else if(req.status >= 400){
    handleError(JSON.parse(req.responseText));
  }
}

/*******************************************************************************************
 * postToServer(currency) - Updates the DOM after AJAX GET request.
 *
 * arguments:
 *   String - describes the currency to which to convert USD.
 *
 * returns:
 *   Object - The request object containing the response.
 */
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
      }
      else if(req.status >= 400){
        handleError(JSON.parse(req.responseText));
      }
    }
  }
  req.send(JSON.stringify({dollars: parseInt(dollars)}));
  return req;
}

/*******************************************************************************************
 * handleError(res) - Displays error information to the user.
 *
 * arguments:
 *   Object - Contains error data.
 *
 * returns:
 *   nothing
 */
function handleError(res){
  document.getElementById('conversionHtml').innerHTML = '<h1>' + res.error + '</h1>';
  document.getElementById('dollars').outerHTML = '<strong>' + res.message;
  document.getElementById('euro').outerHTML = '';
  document.getElementById('pound').outerHTML = '';
  document.getElementById('pop').outerHTML = '';
  document.getElementById('reset').outerHTML = '';
  document.getElementById('history').outerHTML = '';
  if(res.trace) {
    document.getElementById('historyHtml').outerHTML = res.trace;
  }
  else{
    document.getElementById('historyHtml').outerHTML = '';
  }
}