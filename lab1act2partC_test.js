console.log("TESTING calc()");
var c = new Calc();
c.stack = [0,];
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
var expC =
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
c.exec(expC);
