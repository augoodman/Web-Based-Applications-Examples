console.log("TESTING calc()");

// create a Calc object
var c = new Calc();

// initialize stack
c.stack = [0,];

// test calc function and print results to console
console.log(c.calc('{"op":"add","number":5}'));
console.log(c.calc('{"op":"push","number":5}'));
console.log(c.calc('{"op":"pop"}'));
console.log(c.calc('{"op":"push","expr":{"op":"subtract","number":2}}'));
console.log(c.calc('{"op":"push","expr":{"op":"add","number":19}}'));
console.log(c.calc('{"op":"pop"}'));
console.log(c.calc('{"op":"print"}'));
console.log(c.calc('{"op":"push","expr":{"op":"add","expr":{"op":"pop"}}}'));
console.log(c.calc('{"op":"print"}'));
console.log(c.calc('{"op":"pop"}'));
console.log(c.calc('{"op":"pop"}'));
console.log(c.calc('{"op":"pop"}'));
console.log('\n');

console.log("TESTING exec()");

// create an array of above expressions nested with expected result
var expA =
    [
        {"exp":{"op":"add","number":5},"expected":5},
        {"exp":{"op":"push","number":5},"expected":5},
        {"exp":{"op":"pop"},"expected":5},
        {"exp":{"op":"push","expr":{"op":"subtract","number":2}},"expected":-2},
        {"exp":{"op":"push","expr":{"op":"add","number":19}},"expected":17},
        {"exp":{"op":"pop"},"expected":17},
        {"exp":{"op":"push","expr":{"op":"add","expr":{"op":"pop"}}},"expected":-2},
        {"exp":{"op":"pop"},"expected":-2},
        {"exp":{"op":"pop"},"expected":0},
        {"exp":{"op":"pop"},"expected":undefined}
    ];

// test exec function
c.exec(expA);
