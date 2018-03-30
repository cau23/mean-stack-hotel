var mongoose = require('mongoose');
var dburl = 'mongodb://Localhost:27017/meanhotel';

//waiting on mongoose connection to tell when it
//has connected to the database and when done
//output a log to the console;

mongoose.connect(dburl);

mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + dburl);
});
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});
mongoose.connection.on('error', function() {
	console.log('Mongoose connected to error: ' + err);
});

//for UNIX based systems
//exit mongoose
process.on('SIGINT', function () {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through app termination (SIGINT)');
		process.exit(0);
	});
});

process.on('SIGTERM', function () {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through app termination (SIGTERM)');
		process.exit(0);
	});
});

process.on('SIGUSR2', function () {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through app termination (SIGINT)');
		process.kill(process.pid, 'SIGUSR2');
	});
});

// BRING IN SCHEMAS AND MODELS
require('./hotels.model.js');
require('./users.model');