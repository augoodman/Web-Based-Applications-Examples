class Calc {
    value = 0;
    calc(message) {
        let exp = JSON.parse(message);
        if (exp.op === 'add')
            return this.value+=exp.number;
         else if (exp.op === 'subtract')
            return this.value-=exp.number;
    }
    exec(array) {
        if (this.value!==0) this.value = 0;
        for (var i in array) {
            console.log(this.calc(JSON.stringify(array[i].exp)) + " = " + JSON.stringify(array[i].expected));
        }
    }
}
