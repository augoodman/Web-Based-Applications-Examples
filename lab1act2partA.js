/**
 * File: lab1act2partA.js
 * SER 421
 * Lab 1
 *
 * This file implements a Javascript-based prefix calculator as specified in Activity 2 Part A.
 * The Calc class contains behaviors for performing the calculations and printing out the actual
 * results as compared to the expected results.
 *
 * Functions are:
 *    calc(message)
 *    exec(array)
 */
class Calc {
    /* variables */
    value = 0;
    /* functions */
    /*******************************************************************************************
     * calc(message) - Parses a JSON string for an operation and performs that operation with a
     * provided number. Starting value is 0.
     *
     * arguments:
     *   string - formatted as JSON and contains one operation value and one number value.
     *
     * returns:
     *   number - the evaluated solution.
     */
    calc(message) {
        let exp = JSON.parse(message);      // parse string into JSON object
        if (exp.op === 'add')
            return this.value+=exp.number;  // if add operation, return sum
         else if (exp.op === 'subtract')
            return this.value-=exp.number;  // if subtraction operation, return difference
    }

    /*******************************************************************************************
     * exec(array) - Parses a JSON array, stringifying its contents and calling calc with that
     * value as the argument. Prints the result and the expected value to console.
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
