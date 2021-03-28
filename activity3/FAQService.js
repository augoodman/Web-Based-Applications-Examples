/**
 * File: FAQService.js
 * SER 421
 * Lab 2
 *
 * This file implements a basic HTTP service as specified in Activity 3.
 * The service demonstrates basic transactions with the data store.
 *
 * Functions are:
 *    get_logout(username)
 *    createQA(role)
 *    get_faq(username, role)
 *    get_results(role)
 *    get_create_QA(req, res)
 *    login(username, password, role, req, res)
 *    logout(req, res)
 *    edit_question(id, req, res)
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
var criteria = []
var value = []
var dates = []
var is_search = 0
var qa_id = {}
const {FAQ} = require("./FAQ.js")
let faq = new FAQ();
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
 * createQA(role) - Writes HTML for the create Q&A button.
 *
 * arguments:
 *   string - role to be verified for create permissions.
 *
 * returns:
 *   string - create Q&A button HTML
 */
function createQA(role) {
    if(role === 'Instructor') {
        return "<form action=\"http://localhost:3000/create_QA\" method=\"post\">\n" +
               "    <input type=\"submit\" value=\"Create Q&A\">\n" +
               "</form>"
    }
    else return ''
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
    var faq = ''
    if(role === 'student'){
        role = 'Student'
        faq = "<!DOCTYPE html>\n" +
            "<html lang=\"en\">\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <title>FAQ Service</title>\n" +
            "</head>\n" +
            "<body>\n" +
            "    <div id=\"session\">\n" +
            "        <h1>Welcome " + role + " " + username + "</h1>\n" +
            "        <h3>View Q&A</h3>\n" + createQA(role) +
            "        <br><form action=\"http://localhost:3000/home\" method=\"post\">\n" +
            "            <label for=\"author\">Author:</label><input type=\"text\" id=\"author\" name=\"author\"><br>\n" +
            "            <label for=\"tags\">Tags: </label><input type=\"text\" id=\"tags\" name=\"tags\"><br>\n" +
            "            <label for=\"start_date\">Start Date:</label><input type=\"date\" id=\"start_date\" name=\"start_date\"><br>\n" +
            "            <label for=\"end_date\">End Date:</label><input type=\"date\" id=\"end_date\" name=\"end_date\"><br>\n" +
            "            <input type=\"submit\" value=\"Search\">\n" +
            "        </form>\n" +
            "        <br><div>" + get_results(role) + "</div>\n" +
            "        <form action=\"http://localhost:3000/\" method=\"post\">\n" +
            "            <input type=\"submit\" value=\"Logout\">\n" +
            "        </form>\n" +
            "    </div>\n" +
            "</body>\n" +
            "</html>"
    }
    else {
        role = 'Instructor'
        faq = "<!DOCTYPE html>\n" +
            "<html lang=\"en\">\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <title>FAQ Service</title>\n" +
            "</head>\n" +
            "<body>\n" +
            "    <div id=\"session\">\n" +
            "        <h1>Welcome " + role + " " + username + "</h1>\n" +
            "        <h3>View Q&A</h3>\n" + createQA(role) +
            "        <br><form action=\"http://localhost:3000/home\" method=\"post\">\n" +
            "            <label for=\"author\">Author:</label><input type=\"text\" id=\"author\" name=\"author\"><br>\n" +
            "            <label for=\"tags\">Tags: </label><input type=\"text\" id=\"tags\" name=\"tags\"><br>\n" +
            "            <label for=\"start_date\">Start Date:</label><input type=\"date\" id=\"start_date\" name=\"start_date\"><br>\n" +
            "            <label for=\"end_date\">End Date:</label><input type=\"date\" id=\"end_date\" name=\"end_date\"><br>\n" +
            "            <input type=\"submit\" value=\"Search\">\n" +
            "        </form>\n" +
            "        <br><div>" + get_results(role) + "</div>\n" +
            "        <form action=\"http://localhost:3000/\" method=\"post\">\n" +
            "            <input type=\"submit\" value=\"Logout\">\n" +
            "        </form>\n" +
            "    </div>\n" +
            "</body>\n" +
            "</html>"
    }
    return faq
}

/*******************************************************************************************
 * get_results(role) - Writes HTML to display necessary Q&A objects.
 *
 * arguments:
 *   string - role to be verified for Q&A interaction permissions.
 *
 * returns:
 *   string - Q&A list HTML
 */
function get_results(role){
    faq.readFile()
    var results_list = ''
    if(is_search === 0) {
        if (role === 'Student') {
            for (let i in faq.json) {
                results_list += '<li>\n' +
                    '<h2><b>' + JSON.stringify(faq.json[i].question).replace(/\"/g, "") + '</b></h2>\n' +
                    '<h3>' + JSON.stringify(faq.json[i].answer).replace(/\"/g, "") + '</h3>\n' +
                    'Tags: ' + JSON.stringify(faq.json[i].tags).replace(/\"/g, "") + '<br>\n' +
                    'Author: ' + JSON.stringify(faq.json[i].author).replace(/\"/g, "") + '<br>\n' +
                    'Date: ' + JSON.stringify(faq.json[i].date).replace(/\"/g, "") + '<br><br>\n' +
                    '</li>'
            }
            return results_list
        } else {
            for (let i in faq.json) {
                results_list += '<li>\n' +
                    '<h2><b><a href="http://localhost:3000/?id="' + JSON.stringify(faq.json[i].id) + '>' + JSON.stringify(faq.json[i].question).replace(/\"/g, "") + '</a></b></h2>\n' +
                    '<h3>' + JSON.stringify(faq.json[i].answer).replace(/\"/g, "") + '</h3>\n' +
                    'Tags: ' + JSON.stringify(faq.json[i].tags).replace(/\"/g, "") + '<br>\n' +
                    'Author: ' + JSON.stringify(faq.json[i].author).replace(/\"/g, "") + '<br>\n' +
                    'Date: ' + JSON.stringify(faq.json[i].date).replace(/\"/g, "") + '<br><br>\n' +
                    '</li>'
            }
            console.log(results_list)
            return results_list
        }
    }
    else{
        var results = faq.search(criteria, value)
        for (let i in results) {
            results_list += '<li>\n' +
                '<h2><b>' + JSON.stringify(results[i].question).replace(/\"/g, "") + '</b></h2>\n' +
                '<h3>' + JSON.stringify(results[i].answer).replace(/\"/g, "") + '</h3>\n' +
                'Tags: ' + JSON.stringify(results[i].tags).replace(/\"/g, "") + '<br>\n' +
                'Author: ' + JSON.stringify(results[i].author).replace(/\"/g, "") + '<br>\n' +
                'Date: ' + JSON.stringify(results[i].date).replace(/\"/g, "") + '<br><br>\n' +
                '</li>'
        }
        is_search = 0
        return results_list
    }
}

/*******************************************************************************************
 * get_create_QA(req, res) - Displays page for Q&A creation
 *
 * arguments:
 *   object - HTTP request.
 *   object - HTTP response.
 *
 * returns:
 *   nothing
 */
function get_create_QA(req, res) {
    var new_qa = "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "<head>\n" +
        "    <meta charset=\"UTF-8\">\n" +
        "    <title>New Q&A</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "    <div id=\"session\"><h1>Create New Question and Answer</h1>\n" +
        "        <form action=\"http://localhost:3000/home\" method=\"post\">\n" +
        "            <label for=\"question\">Question:</label><input type=\"text\" id=\"question\" name=\"question\" required><br>\n" +
        "            <label for=\"answer\">Answer: </label><input type=\"text\" id=\"answer\" name=\"answer\" required><br>\n" +
        "            <label for=\"tags\">Tags:</label><input type=\"text\" id=\"tags\" name=\"tags\" required><br>\n" +
        "            <input type=\"submit\" value=\"Save\">\n" +
        "        </form>\n" +
        "        <form action=\"http://localhost:3000/home\" method=\"post\">\n" +
        "            <input type=\"button\" value=\"Cancel\">\n" +
        "        </form>\n" +
        "    </div>\n" +
        "</body>\n" +
        "</html>"
    res.writeHead(200, {
        'Content-Type': 'text/html',
    })
    req.url = '/'
    res.end(new_qa)
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
 * edit_question(id, req, res) - Allows an instructor user to edit a Q&A
 *
 * arguments:
 *   number - ID attribute of question to be edited.
 *   object - HTTP request.
 *   object - HTTP response.
 *
 * returns:
 *   nothing
 */
function edit_question(id, req, res) {
    qa_id = id
    if(session.role === "instructor"){
        var answer = {}
        var tags = {}
        for(let i in faq.json){
            if(id === faq.json[i].id){
                answer = faq.json[i].answer
                tags = faq.json[i].tags
            }
        }
        var update = "<!DOCTYPE html>\n" +
            "<html lang=\"en\">\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <title>Edit Question</title>\n" +
            "</head>\n" +
            "<body>\n" +
            "    <div id=\"session\"><h1>Edit Question</h1>\n" +
            "        <form action=\"http://localhost:3000/home\" method=\"post\">\n" +
            "            <label for=\"answer\">Current Answer: " + answer + "</label><br>\n" +
            "            <label for=\"answer\">New Answer: </label><input type=\"text\" id=\"new_answer\" name=\"new_answer\"><br>\n" +
            "            <label for=\"tags\">Current Tags:" + tags + "</label><br>\n" +
            "            <label for=\"tags\">New Tags:</label><input type=\"text\" id=\"new_tags\" name=\"new_tags\"><br>\n" +
            "            <input type=\"submit\" value=\"Save\">\n" +
            "        </form>\n" +
            "        <form action=\"http://localhost:3000/home\" method=\"post\">\n" +
            "            <input type=\"button\" value=\"Cancel\">\n" +
            "        </form>\n" +
            "    </div>\n" +
            "</body>\n" +
            "</html>"
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        res.end(update)
    }
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
            if(postParams.username !== undefined) {
                login(postParams.username, postParams.password, postParams.role, req, res)
                if (session.status === 1) {
                    console.log("Logged in as " + postParams.username)
                    console.log("Role: " + postParams.role)
                } else {
                    console.log("Login failed")
                }
            }
            if(postParams.question !== undefined){
                var qa = '{\n' +
                    '"question": "' + postParams.question + '",\n'+
                    '"answer": "' + postParams.answer + '",\n'+
                    '"tags": "' + postParams.tags + '",\n'+
                    '"author": "' + session.username + '",\n'+
                    '"date": "' + new Date().toLocaleDateString() + '"\n'+
                    '}'
                faq.write(qa)
                req.url = '/home'
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Set-Cookie': 'last_user=' + session.username
                })
                res.end(get_faq(session.username, session.role))
            }
            if(postParams.new_tags !== undefined || postParams.new_answer !== undefined) {
                if(postParams.new_tags !== undefined){
                    faq.updateTags(qa_id, postParams.tags)
                }
                if(postParams.new_answer !== undefined){
                    faq.updateTags(qa_id, postParams.new_answer)
                }
                qa_id = {}
                req.url = '/home'
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Set-Cookie': 'last_user=' + session.username
                })
                res.end(get_faq(session.username, session.role))
            }
            if(postParams.tags !== undefined || postParams.author !== undefined || postParams.start_date !== undefined || postParams.end_date !== undefined){
                console.log("Searching...")
                criteria = []
                value = []
                is_search = 1
                if(postParams.author !== undefined){
                    console.log("author...")
                    criteria.push("author")
                    value.push(postParams.author)
                }
                if(postParams.tags !== undefined){
                    console.log("tags...")
                    criteria.push("tags")
                    value.push(postParams.tags)
                }
                if(postParams.start_date !== undefined){
                    console.log("date...")
                    criteria.push("date")
                    dates[0] = postParams.start_date
                    dates[1] = postParams.end_date
                    value.push(dates)
                }
                req.url = '/home'
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Set-Cookie': 'last_user=' + session.username
                })
                res.end(get_faq(session.username, session.role))
            }
            else{
                req.url = '/home'
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Set-Cookie': 'last_user=' + session.username
                })
                res.end(get_faq(session.username, session.role))
            }
        })
    }
    if(req.url === "/home" && session.status === 0) {
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
    if(req.url === "/create_QA" && req.method === "POST") {
        let reqData = ''
        req.on('data', function (chunk) {
            reqData += chunk
        })
        req.on('end', function () {
            get_create_QA(req, res)
        })
    }
}).listen(3000)