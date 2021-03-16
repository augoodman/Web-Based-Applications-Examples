/**
 * File: lab1act2partB_test.js
 * SER 421
 * Lab 1
 *
 * This file contains a simple test stub for testing lab1act2partB.js.
 */
console.log("TESTING calc()");

// create a Calc object
var c = new Calc();

// test calc function and print results to console
console.log(c.calc('{"op": "subtract", "expr" : {"op" : "add", "number" : 15}}'));
console.log(c.calc('{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 3}}}'));
console.log('\n');

console.log("TESTING exec()");

// create an array of above expressions nested with expected result
var expA =
    [
        {"exp":{"op": "subtract", "expr" : {"op" : "add", "number" : 15}},"expected":0},
        {"exp":{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 3}}},"expected":-12},
    ];

// test exec function
c.exec(expA);
