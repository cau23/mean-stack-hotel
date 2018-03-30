//data schema for hotel data
var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	rating : {
		type : Number,
		min : 0,
		max : 5,
		required : true
	},
	review : {
		type : String,
		required : true
	},
	createdOn : {
		type : Date,
		"default" : Date.now
	}
});

var roomSchema = new mongoose.Schema({
	type : String,
	number : Number,
	description : String,
	photos : [String],
	price : Number
});

//base for creating a schema
var hotelSchema = new mongoose.Schema({
	//from hotel-data.json file
	name : {
		type : String,
		required : true
	},
	stars : {
		type : Number,
		min : 0,
		max : 5,
		"default" : 0
	},
	services : [String],
	description : String,
	photos : [String],
	currency : String,
	reviews : [reviewSchema],
	rooms : [roomSchema],
	location : {
		address : String,
		//always store coordinates longitude [E/W], latitude {N/W]
		coordinates : {
			type : [Number],
			//will tell mongodb to index coordinates in path
			//and map as a sphere
			index : '2dsphere'
		}
	}
});

//way to compile a model from mongoose schema
//'Hotel' model name maps to lower case pluralized 'hotels'
//which is the collection name (optional) now removed
mongoose.model('Hotel', hotelSchema);
