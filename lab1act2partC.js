/**
 * File: lab1act2partC.js
 * SER 421
 * Lab 1
 *
 * This file implements a Javascript-based prefix calculator as specified in Activity 2 Part C.
 * Calc class functions are extended to process results on a stack-based memory store.
 *
 * Functions are:
 *    calc(message)
 *    exec(array)
 */
class Calc {
    stack = [0];
    /*******************************************************************************************
     * calc(message) - Parses a JSON string for an operation and performs that operation with a
     * provided number, stack function, processes a nested expression of these types or prints
     * out the stack from top to bottom. Starting value is 0.
     *
     * arguments:
     *   string - formatted as JSON and contains one or more nested operations.
     *
     * returns:
     *   number - the evaluated solution.
     */
    calc(message) {
        let exp = JSON.parse(message);
        if (exp.hasOwnProperty('expr')){
            exp.expr = this.calc(JSON.stringify(exp.expr));
            exp = JSON.parse(JSON.stringify(exp).replace("expr","number"));
        }
        if (exp.op === 'add') {
            return this.stack[this.stack.length - 1] + exp.number;
        }
        else if (exp.op === 'subtract') {
            return this.stack[this.stack.length - 1] - exp.number;
        }
        else if (exp.op === 'push') {       // add operation for pushing a result onto the stack
            this.stack.push(exp.number);
            return this.stack[this.stack.length - 1];
        }
        else if (exp.op === 'pop') {        // add operation for popping a result from the stack
            return this.stack.pop();
        }
        else if (exp.op === 'print') {      // add operation for printing the stack
            console.log("Printing stack:")
            for (var i = 0; i < this.stack.length; i++) {
                console.log("[" + this.stack[this.stack.length-i-1] + "]");
            }
        }
    }

    /*******************************************************************************************
     * exec(array) - Parses a JSON array, stringifying its contents and calling calc with that
     * value as the argument. Prints the result and the expected value to console. Unchanged
     * from part B.
     *
     * arguments:
     *   array - JSON array containing one or more expressions to be evaluated.
     *
     * returns:
     *   nothing - Result is instead printed to console.
     */
    exec(array) {
        if (this.value!==0) this.value = 0;
        for (var i in array) {
            console.log(this.calc(JSON.stringify(array[i].exp)) + " = " + JSON.stringify(array[i].expected));
        }
    }
}


