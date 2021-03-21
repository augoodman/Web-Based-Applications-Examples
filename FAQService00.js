// todo setup server on port 3000
import fs from 'fs'
import http from 'http'
import url from 'url'

const ROOT_DIR = "html/";

var messages = ['Hello World', 'From a Node.jsserver', 'Take Luck'];
http.createServer(function (req, res) {
    var resBody = '';
    var resMsg = '';
    var urlObj = url.parse(req.url, true, false);
    var qstr = urlObj.query;
    if (req.method === "GET") {
        console.log(req.method);
        if (!qstr.msg) {
            resMsg = '<h2>No msgparameter</h2>\n';
        } else {
            resMsg = '<h1>' + messages[qstr.msg] + '</h2>';
        }
        resBody = resBody + '<html><head><title>Simple HTTP Server</title></head>';
        resBody = resBody + '<body>' + resMsg;
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(resBody + '\n</body></html>');
    } else if (req.method === "POST"){
        var reqData= '';
        req.on('data', function (chunk) {
            reqData+= chunk;
        });
        req.on('end', function() {
            var postParams= qstring.parse(reqData);
            getWeather(postParams.city, res);
        });
    } else{
        sendResponse(null, res);
    }
}).listen(3000);

// todo create instructor and student session classes
