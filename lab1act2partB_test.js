console.log("TESTING calc()");
var c = new Calc();
console.log(c.calc('{"op": "subtract", "expr" : {"op" : "add", "number" : 15}}'));
console.log(c.calc('{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 3}}}'));
console.log('\n');
console.log("TESTING exec()");
var expA =
    [
        {"exp":{"op": "subtract", "expr" : {"op" : "add", "number" : 15}},"expected":0},
        {"exp":{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 3}}},"expected":-12},
    ];
c.exec(expA);
