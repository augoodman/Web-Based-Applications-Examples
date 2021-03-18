/**
 * File: FAQ00_test.js
 * SER 421
 * Lab 2
 *
 * This file contains a simple test stub for testing FAQ00.js.
 */
import {FAQ} from "./FAQ00.js"

// create a FAQ object
const faq = new FAQ();

// test write and print results to console
console.log("TEST 1")
let t1 = '{\n' +
    '  "question": "What is the meaning of Life, the Universe and Everything?",\n' +
    '  "answer": "42",\n' +
    '  "tags": "hitchhiker\'s guide, ultimate question",\n' +
    '  "author": "Douglas Adams",\n' +
    '  "date": "2021-03-17T21:43:39.420"\n' +
    '}'
console.log("Writing the following question: ")
console.log(JSON.parse(t1))
faq.write(t1)

// test update answer and print results to console
console.log("\nTEST 2")
let t2 = [1567311491853.5676, "March 28th, 11:59pm"]
console.log("Updating question with ID: " + t2[0])
console.log("New answer is: " + t2[1])
faq.updateAnswer(t2[0], t2[1])

// test update tags and print results to console
console.log("\nTEST 3")
let t3 = [1567311491853.5676, "due date, FAQ, assign 2"]
console.log("Updating tags with ID: " + t3[0])
console.log("New tags are: " + t3[1])
faq.updateTags(t3[0], t3[1])

// test delete Q&A and print results to console
console.log("\nTEST 4")
let t4 = 1616095528900
console.log("Deleting Q&A with ID: " + t4)
faq.delete(t4)

// test search by author and print results to console
console.log("\nTEST 5")
let t5 = [["author"], ["Dr.M"]]
console.log("Searching for author: " + t5[1])
let authorSearch = faq.search(t5[0], t5[1])
console.log("Author search returned " + authorSearch.length + " results:")
console.log(authorSearch)

// test search by tags and print results to console
console.log("\nTEST 6")
let t6 = [["tags"], [["java script", "assign 2"]]]
console.log("Searching for tags: " + t6[1])
let tagSearch = faq.search(t6[0], t6[1])
console.log("Tag search returned " + tagSearch.length + " results:")
console.log(tagSearch)

// test search by tags and print results to console
console.log("\nTEST 7")
let t7 = [["date"], [["2019-09-01", "2019-09-30"]]]
console.log("Searching in date range: " + t7[1])
let dateSearch = faq.search(t7[0], t7[1])
console.log("Date search returned " + dateSearch.length + " results:")
console.log(dateSearch)

// test search by multiple criteria and print results to console
console.log("\nTEST 8")
let t8 = [["date", "author", "tags"], [["2021-01-01", "2021-12-31"],"Dr.G",["blackbox"]]]
console.log("Searching with following criteria: " + t8[0] + "...")
console.log("...for the following values: " + t8[1])
let multiSearch = faq.search(t8[0], t8[1])
console.log("Multi search returned " + multiSearch.length + " results:")
console.log(multiSearch)
