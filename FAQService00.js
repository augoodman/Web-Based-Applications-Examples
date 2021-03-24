const fs = require('fs');
const http = require('http');
const url = require('url');
const qstring = require('querystring');
const ROOT_DIR = "html/";
const session = {}
session.status = 0
session.username = undefined
session.role = undefined
var index = fs.readFileSync(ROOT_DIR + 'index.html').toString()

const login = function(username, password, role, req, res){
    console.log('Logging in...')
    if (username === password) {
        session.status = 1
        session.username = username
        session.role = role
        req.url = '/faq'
        fs.readFile(ROOT_DIR + 'faq.html', function (err, data) {
            if (err) {
                res.writeHead(404)
                res.end(JSON.stringify(err))
            }
            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Set-Cookie': 'last_user=' + session.username
            })
            res.end(data)
        })
    }
    else{
        fs.readFile(ROOT_DIR + 'index.html', function (err, data) {
            if (err) {
                res.writeHead(404)
                res.end(JSON.stringify(err))
            }
            res.writeHead(200, {
                'Content-Type': 'text/html',
            })
            req.url = '/home'
            res.end(data += '<h3>The supplied password was incorrect. Please try again.</h3>')
        })
    }

}

http.createServer((req, res) => {
    if(req.url === "/home" || req.url === "/"){
        index = fs.readFile(ROOT_DIR + 'index.html', function (err, data) {
                if (err) {
                    res.writeHead(404)
                    res.end(JSON.stringify(err))
                    return;
                }
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                })
                res.end(data);
            })
    }
    if(req.method === "POST") {
        //if (req.url === "/faq") {
            var reqData = ''
            req.on('data', function (chunk) {
                reqData += chunk
            })
            req.on('end', function () {
                var postParams = qstring.parse(reqData)
                login(postParams.username, postParams.password, postParams.role, req, res)
                if (session.status === 1) {
                    console.log("Logged in as " + postParams.username)
                    console.log("Role: " + postParams.role)
                } else {
                    console.log("Login failed")
                }
            })
       // }
    }
}).listen(3000)

//.load FAQService00.js