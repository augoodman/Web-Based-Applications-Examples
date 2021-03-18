import {FAQ} from "./FAQ00.js"

// create a FAQ object
const faq = new FAQ();


// test write function and print results to console
const t1 = '{\n' +
    '  "question": "What is the meaning of Life, the Universe and Everything?",\n' +
    '  "answer": "42",\n' +
    '  "tags": "hitchhiker\'s guide, ultimate question",\n' +
    '  "author": "Douglas Adams",\n' +
    '  "date": "2021-03-17T21:43:39.420",\n' +
    '  "id": 1567311456814.3071\n' +
    '}'
console.log("Writing the following question: ")
console.log(t1)
faq.write(t1)
console.log("New file contents: ")
console.log(JSON.stringify(faq.json))
