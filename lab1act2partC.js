class Calc {
    stack = [0];
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
        else if (exp.op === 'push') {
            this.stack.push(exp.number);
            return this.stack[this.stack.length - 1];
        }
        else if (exp.op === 'pop') {
            return this.stack.pop();
        }
        else if (exp.op === 'print') {
            console.log("Printing stack:")
            for (var i = 0; i < this.stack.length; i++) {
                console.log("[" + this.stack[this.stack.length-i-1] + "]");
            }
        }
    }
    exec(array) {
        if (this.value!==0) this.value = 0;
        for (var i in array) {
            console.log(this.calc(JSON.stringify(array[i].exp)) + " = " + JSON.stringify(array[i].expected));
        }
    }
}


