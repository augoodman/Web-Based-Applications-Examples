/**
 * File: FAQService00.js
 * SER 421
 * Lab 2
 *
 * This file implements a basic HTTP service as specified in Activity 2.
 * The service demonstrates basic login/logout functionality
 *
 * Functions are:
 *    get_logout(username)
 *    get_faq(username, role)
 *    login(username, password, role, req, res)
 *    logout(req, res)
 *    createServer((req, res) => callback)
 */
/* imports */
const http = require('http')
const qstring = require('querystring')
/* global variables */
const session = {}
session.status = 0
session.username = undefined
session.role = undefined
var index = "<!DOCTYPE html>\n" +
    "<html lang=\"en\">\n" +
    "<head>\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title>Login</title>\n" +
    "</head>\n" +
    "<body>\n" +
    "    <h1>FAQ Service Login</h1>\n" +
    "    <form action=\"http://localhost:3000/home\" method=\"post\">\n" +
    "        <label for=\"username\">Username:</label><input type=\"text\" id=\"username\" name=\"username\" required><br>\n" +
    "        <label for=\"password\">Password: </label><input type=\"password\" id=\"password\" name=\"password\" required><br>\n" +
    "        <p>Select your user role.</p>\n" +
    "        <label for=\"student\">Student</label><input type=\"radio\" name=\"role\" value=\"student\" checked=\"checked\"><br>\n" +
    "        <label for=\"instructor\">Instructor</label><input type=\"radio\" name=\"role\" value=\"instructor\"><br>\n" +
    "        <input type=\"submit\" value=\"Login\">\n" +
    "    </form>\n" +
    "</body>\n" +
    "</html>"
var index_bad_login = "<!DOCTYPE html>\n" +
    "<html lang=\"en\">\n" +
    "<head>\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <title>Login</title>\n" +
    "</head>\n" +
    "<body>\n" +
    "    <h1>FAQ Service Login</h1>\n" +
    "    <form action=\"http://localhost:3000/home\" method=\"post\">\n" +
    "        <label for=\"username\">Username:</label><input type=\"text\" id=\"username\" name=\"username\" required><br>\n" +
    "        <label for=\"password\">Password: </label><input type=\"password\" id=\"password\" name=\"password\" required><br>\n" +
    "        <p>Select your user role.</p>\n" +
    "        <label for=\"student\">Student</label><input type=\"radio\" name=\"role\" value=\"student\" checked=\"checked\"><br>\n" +
    "        <label for=\"instructor\">Instructor</label><input type=\"radio\" name=\"role\" value=\"instructor\"><br>\n" +
    "        <input type=\"submit\" value=\"Login\">\n" +
    "    </form>\n" +
    "    <h3>The supplied password was incorrect. Please try again.</h3>\n" +
    "</body>\n" +
    "</html>"

/* functions */
/*******************************************************************************************
 * get_logout(username) - Writes HTML for the logout page.
 *
 * arguments:
 *   string - username to be printed on logout page.
 *
 * returns:
 *   string - logout page HTML
 */
function get_logout(username) {
    var index_logout = "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "<head>\n" +
        "    <meta charset=\"UTF-8\">\n" +
        "    <title>Login</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "    <h1>FAQ Service Login</h1>\n" +
        "    <form action=\"http://localhost:3000/home\" method=\"post\">\n" +
        "        <label for=\"username\">Username:</label><input type=\"text\" id=\"username\" name=\"username\" required><br>\n" +
        "        <label for=\"password\">Password: </label><input type=\"password\" id=\"password\" name=\"password\" required><br>\n" +
        "        <p>Select your user role.</p>\n" +
        "        <label for=\"student\">Student</label><input type=\"radio\" name=\"role\" value=\"student\" checked=\"checked\"><br>\n" +
        "        <label for=\"instructor\">Instructor</label><input type=\"radio\" name=\"role\" value=\"instructor\"><br>\n" +
        "        <input type=\"submit\" value=\"Login\">\n" +
        "    </form>\n" +
        "    <h3>Goodbye " + username + ". Pleas come back soon.</h3>\n" +
        "</body>\n" +
        "</html>"
    return index_logout
}

/*******************************************************************************************
 * get_faq(username, role) - Writes HTML for the FAQ home page.
 *
 * arguments:
 *   string - username to be printed on FAQ home page.
 *   string - role to be printed on FAQ home page.
 *
 * returns:
 *   string - FAQ home page HTML
 */
function get_faq(username, role) {
    if(role === "student") role = "Student"
    else role = "Instructor"
    var faq = "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "<head>\n" +
        "    <meta charset=\"UTF-8\">\n" +
        "    <title>FAQ Service</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "    <div id=\"session\">\n" +
        "        <h1>Welcome " + role + " " + username + "</h1>\n" +
        "        <h3>View Q&A</h3>\n" +
        "        <form action=\"http://localhost:3000/\" method=\"post\">\n" +
        "            <input type=\"submit\" value=\"Logout\">\n" +
        "        </form>\n" +
        "    </div>\n" +
        "</body>\n" +
        "</html>"
    return faq
}

/*******************************************************************************************
 * login(username, password, role, req, res) - Logs user into service if correct credentials
 * are provided.
 *
 * arguments:
 *   string - username credential to be checked.
 *   string - password credential to be checked.
 *   string - role to determine permissions.
 *   object - HTTP request.
 *   object - HTTP response.
 *
 * returns:
 *   nothing
 */
const login = function(username, password, role, req, res){
    console.log('Logging in...')
    if (username === password) {
        session.status = 1
        session.username = username
        session.role = role
        req.url = '/home'
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Set-Cookie': 'last_user=' + session.username
        })
        res.end(get_faq(username, role))
    }
    else{
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        req.url = '/'
        res.end(index_bad_login)
    }
}

/*******************************************************************************************
 * logout(req, res) - Logs user out of service
 *
 * arguments:
 *   object - HTTP request.
 *   object - HTTP response.
 *
 * returns:
 *   nothing
 */
function logout(req, res) {
    console.log('Logging out...')

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Set-Cookie': 'last_user=' + session.username
    })
    res.end(get_logout(session.username))
    session.status = 0
    session.username = undefined
    session.role = undefined
}

/*******************************************************************************************
 * createServer((req, res) => callback) - Routes HTTP requests and responses
 *
 * arguments:
 *   function - HTTP callback function
 *
 * returns:
 *   nothing
 */
http.createServer((req, res) => {
    if(req.url === "/"){
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.end(index);
    }
    if(req.url === "/home" && req.method === "POST") {
        let reqData = ''
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
    }
    if(req.url === "/home" && session.status === 0) {
        req.url === "/"
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.end(index);
    }
    if(req.url === "/" && req.method === "POST") {
        let reqData = ''
        req.on('data', function (chunk) {
            reqData += chunk
        })
        req.on('end', function () {
            logout(req, res)
        })
    }
}).listen(3000)