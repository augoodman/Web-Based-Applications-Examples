const express = require('express');
const router = express.Router();
const requestIp = require('@supercharge/request-ip')

let historyStack = [];

/* GET SPA page */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Currency Converter' });
});

/* POST Euro API call */
router.post('/euro', function(req, res, next) {
  if(isNaN(req.body.dollars) || req.body.dollars <= 0 || req.body.dollars === null){
    badRequest(res);
    return;
  }
  try{
    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');
    historyStack.push({
      'dollars': parseInt(req.body.dollars), 'value': parseInt(req.body.dollars) * 0.9, 'currency': "Euro",
      'ip': requestIp.getClientIp(req).toString(), 'agent': req.headers['user-agent']
    });
    res.send(JSON.stringify(historyStack[historyStack.length - 1]));
  }
  catch (e){
    serverError(res, e);
  }
});

/* POST Pound API call */
router.post('/pound', function(req, res, next) {
  if(isNaN(req.body.dollars) || req.body.dollars <= 0 || req.body.dollars === null){
    badRequest(res);
    return;
  }
  try{
    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');
    historyStack.push({
      'dollars': parseInt(req.body.dollars), 'value': parseInt(req.body.dollars) * 0.78, 'currency': "Pound",
      'ip': requestIp.getClientIp(req).toString(), 'agent': req.headers['user-agent']});
    res.send(JSON.stringify(historyStack[historyStack.length - 1]));
  }
  catch (e){
    serverError(res, e);
  }
});

/* GET Pop API call */
router.get('/pop', function(req, res, next) {
  try{
    if(historyStack.length !== 0) {
      console.log('here')
      res.set('Content-Type', 'application/json');
      res.set('Access-Control-Allow-Origin', '*');
      res.send('{"pop": ' + JSON.stringify(historyStack.pop()) + '}');
    }
    else{
      badRequest(res);
    }
  }
  catch (e){
    serverError(res, e);
  }
});

/* History API call */
router.get('/history', function(req, res, next) {
  try{
    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');
    if(historyStack !== []){
      let history = '{"history": [';
      if (historyStack.length > 0) {
        for (let i = 0; i < historyStack.length; i++) {
          if (i !== historyStack.length - 1) {
            history += JSON.stringify(historyStack[i]) + ', ';
          } else {
            history += JSON.stringify(historyStack[i]) + ']}';
          }
        }
      } else {
        history = '{"history": 0}';
      }
      res.send(history);
    }
    else{
      badRequest(res);
    }
  }
  catch (e){
    serverError(res, e);
  }
});

/* Reset API call */
router.get('/reset', function(req, res, next) {
  try{
    historyStack = [];
    res.send('{"reset": true}');
  }
  catch (e){
    serverError(res, e);
  }
});

/* convert to History API call */
router.get('/api', function(req, res, next) {
  try{
    res.render('api', { title: 'Lab 5 API Documentation' });
  }
  catch (e){
    serverError(res, e);
  }
});

function badRequest(res) {
  res.status(400).send({
    message: 'Bad request.',
    error: 400
  });
}

function serverError(res, error) {
  res.status(500).send({
    message: 'Internal server error.',
    error: 500,
    trace: error.stack
  });
}

module.exports = router;
