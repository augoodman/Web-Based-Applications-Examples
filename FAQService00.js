var fs = require('fs');
var http = require('http');
var url = require('url');
var qstring = require('querystring');
var ROOT_DIR = "html/";
var session = {}
session.status = 0
session.username = "some name"
session.role = undefined
http.createServer((req, res) => {
    var urlObj = url.parse(req.url, true, false);
    console.log(urlObj);
    if(urlObj.pathname === "/home"){
        if(req.method === "POST"){
            var reqData = ''
            req.on('data', function (chunk) {
                reqData += chunk
            })
            req.on('end', function() {
                console.log('here');
                var postParams = qstring.parse(reqData)
                login(postParams.username, postParams.password, postParams.role)
                if(session.status === 1){
                    console.log("logged in as " + postParams.username)
                    urlObj.pathname = "/faq"
                }
            })
        }
        else {
            fs.readFile(ROOT_DIR + 'index.html', function (err, data) {
                if (err) {
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                })
                res.end(data);
            })
        }
    }
    else if(urlObj.pathname === "/faq"){
        fs.readFile(ROOT_DIR + 'faq.html', function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Set-Cookie': 'last_user=' + session.username
            })
            res.end(data);
        })
    }
}).listen(3000)

var login = function(username, password, role){
    console.log('Logging in...');
    if (username === password) {
        session.status = 1
        session.username = username
        session.role = role
        console.log(session)
    }
    else{
        session.status = 0
        session.username = username
        session.role = role
        console.log(session)
    }
}

var content_map = {
    '/' : "default page",
    '/home' : "home page",
    '/faq' : "faq service"
}
// .load FAQService00.js
