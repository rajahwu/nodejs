fs = require('fs');
const rootDir = "/var/www/html/apps/Training/nodejs";

function  phoneNumber(err, data) {
    console.log('data:', data);
}

fs.readdir(`${rootDir}`, phoneNumber);

console.log("This comes after");