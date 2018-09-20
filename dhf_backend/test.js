let {BigNumber}  = require('bignumber.js');
let a = BigNumber('');

let b = BigNumber('0');

let c = BigNumber('0.0');

console.log(a, b, a === b);
console.log(a, c, a === c);
console.log(b, c, b === c);
console.log(a, a === 0);
let  d = BigNumber('0.001');

console.log(a, a.gt(0));
console.log(b, b.gt(0));
console.log(c, c.gt(0));
console.log(d, d.gt(0));

