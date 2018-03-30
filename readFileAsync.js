var fs = require('fs');

var onFileLoad = function(err, file) {
	console.log("Get the file");
};
console.log("Going to get a file");
fs.readFile('readFileSync.js', onFileLoad);
	

console.log("App continuess...");