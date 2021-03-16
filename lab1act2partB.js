/**
 * File: lab1act2partB.js
 * SER 421
 * Lab 1
 *
 * This file implements a Javascript-based prefix calculator as specified in Activity 2 Part B.
 * Calc class functions are extended to process nested operations.
 *
 * Functions are:
 *    calc(message)
 *    exec(array)
 */
class Calc {
    value = 0;
    /*******************************************************************************************
     * calc(message) - Parses a JSON string for an operation and performs that operation with a
     * provided number or a nested operation. Starting value is 0.
     *
     * arguments:
     *   string - formatted as JSON and contains one or more nested operations.
     *
     * returns:
     *   number - the evaluated solution.
     */
    calc(message) {
        let exp = JSON.parse(message);
        if (exp.hasOwnProperty('expr')){                    // parse out any nested expressions
            exp.expr = this.calc(JSON.stringify(exp.expr));    // recursively perform calculations
            exp = JSON.parse(JSON.stringify(exp).replace("expr","number")); // replace nested
        }                                                                                         // expression with result
        if (exp.op === 'add')
            return this.value += exp.number;
        else if (exp.op === 'subtract')
            return this.value -= exp.number;
    }

    /*******************************************************************************************
     * exec(array) - Parses a JSON array, stringifying its contents and calling calc with that
     * value as the argument. Prints the result and the expected value to console. Unchanged
     * from part A.
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
