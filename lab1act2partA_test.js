console.log("TESTING calc()");
var c = new Calc();
console.log(c.calc('{"op":"add","number":0}'));
console.log(c.calc('{"op":"add","number":-1}'));
console.log(c.calc('{"op":"subtract","number":-1}'));
console.log(c.calc('{"op":"add","number":5}'));
console.log(c.calc('{"op":"subtract","number":10}'));
console.log(c.calc('{"op":"add","number":15}'));
console.log('\n');
console.log("TESTING exec()");
var expA =
[
    {"exp":{"op":"add","number":0},"expected":0},
    {"exp":{"op":"add","number":-1},"expected":-1},
    {"exp":{"op":"subtract","number":-1},"expected":0},
    {"exp":{"op":"add","number":5},"expected":5},
    {"exp":{"op":"subtract","number":10},"expected":-5},
    {"exp":{"op":"add","number":15},"expected":10}
];
c.exec(expA);
