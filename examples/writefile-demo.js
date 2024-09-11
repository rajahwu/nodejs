const fs = require('fs');

const data = {
    "firstName": "Vincent",
    "lastName": "Radford"
}


fs.writeFile(
    'data-write-demo.json', 
    JSON.stringify(data), 
    'utf8', 
    (err) => {
        if (err) throw err;
        console.log('File has been written');
    }
);