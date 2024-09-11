fs = require('fs');

data = fs.readdirSync('/var');
console.log('data', data);

console.log("This comes after");

