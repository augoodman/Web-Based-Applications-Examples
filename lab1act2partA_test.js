/**
 * File: lab1act2partA_test.js
 * SER 421
 * Lab 1
 *
 * This file contains a simple test stub for testing lab1act2partA.js.
 */
console.log("TESTING calc()");

// create a Calc object
var c = new Calc();

// test calc function and print results to console
console.log(c.calc('{"op":"add","number":0}'));
console.log(c.calc('{"op":"add","number":-1}'));
console.log(c.calc('{"op":"subtract","number":-1}'));
console.log(c.calc('{"op":"add","number":5}'));
console.log(c.calc('{"op":"subtract","number":10}'));
console.log(c.calc('{"op":"add","number":15}'));
console.log('\n');

console.log("TESTING exec()");

// create an array of above expressions nested with expected result
var expA =
[
    {"exp":{"op":"add","number":0},"expected":0},
    {"exp":{"op":"add","number":-1},"expected":-1},
    {"exp":{"op":"subtract","number":-1},"expected":0},
    {"exp":{"op":"add","number":5},"expected":5},
    {"exp":{"op":"subtract","number":10},"expected":-5},
    {"exp":{"op":"add","number":15},"expected":10}
];

// test exec function
c.exec(expA);
