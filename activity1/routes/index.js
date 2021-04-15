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
  res.set('Content-Type', 'application/json');
  res.set('Access-Control-Allow-Origin', '*');
  historyStack.push({'dollars': parseInt(req.body.dollars), 'value': parseInt(req.body.dollars) * 0.9, 'currency': "Euro",
    'ip': requestIp.getClientIp(req).toString(), 'agent': req.headers['user-agent']});
  res.send(JSON.stringify(historyStack[historyStack.length - 1]));
});

/* POST Pound API call */
router.post('/pound', function(req, res, next) {
  res.set('Content-Type', 'application/json');
  res.set('Access-Control-Allow-Origin', '*');
  historyStack.push({'dollars': parseInt(req.body.dollars), 'value': parseInt(req.body.dollars) * 0.78, 'currency': "Pound",
    'ip': requestIp.getClientIp(req).toString(), 'agent': req.headers['user-agent']});
  res.send(JSON.stringify(historyStack[historyStack.length - 1]));
});

/* GET Pop API call */
router.get('/pop', function(req, res, next) {
  res.set('Content-Type', 'application/json');
  res.set('Access-Control-Allow-Origin', '*');
  res.send('{"pop": ' + JSON.stringify(historyStack.pop()) + '}');
});

/* History API call */
router.get('/history', function(req, res, next) {
  res.set('Content-Type', 'application/json');
  res.set('Access-Control-Allow-Origin', '*');
  let history = '{"history": [';
  for(let i = 0; i < historyStack.length; i++){
    if(i !== historyStack.length - 1) {
      history += JSON.stringify(historyStack[i]) + ', ';
    }
    else{
      history += JSON.stringify(historyStack[i]) + ']}';
    }
  }
  res.send(history);
});


/* convert to History API call */
router.delete('/reset', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* convert to History API call */
router.get('/api', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
