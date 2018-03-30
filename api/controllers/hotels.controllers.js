//mongoose now in our controller
var mongoose = require('mongoose');
//reference to our model
//use this model inside contollers to interact with database
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {
	//extract values from query string
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);

	//error trapping if lng and lat is not found - activity 31
	if (isNaN(lng) || isNaN(lat)) {
		res
			.status (400)
			.json ({
				"message" : "Lng and Lat must be numbers if supplied in querystring"
			});
			return;
	}

	//GeoJSON point
	var point = {
		type : "Point",
		coordinates : [lng, lat]
	};

	var geoOptions = {
		spherical : true,
		maxDistance : 2000,
		num : 5
	};

	// Mongoose Query
	Hotel
		.geoNear(point, geoOptions, function(err, results, stats) {
			console.log('Geo results', results);
			console.log('Geo stats', stats);
			res 
				.status(200)
				.json(results);
		});
};

module.exports.hotelsGetAll = function(req, res) {
	//line 46 - access the user property
	console.log('Requested by: ' + req.user);
	console.log('Get the hotels');
	console.log(req.query);

	var offset = 0;
	var count = 5;
	//add protection into controller
	var maxCount = 10;

	if (req.query && req.query.lat && req.query.lng) {
		runGeoQuery(req, res);
		return;
	}

	if(req.query && req.query.offset) {
	offset = parseInt(req.query.offset, 10);
	 }

	if(req.query && req.query.count) {
	count = parseInt(req.query.count, 10);
	}

	//stop process the control if the query string is wrong
	if(isNaN(offset) || isNaN(count)) {
		res
			.status(400)
			.json({
				"message" : "If supplied in querystring count and offset should be number"
			})
		return;
	}

	//add max count of records
	if (count > maxCount) {
		res
			.status(400)
			.json({
				"message" : "Count limit of " + maxCount + " exceeded"
			});
			return;
	}

	//hotels model
	Hotel
		.find()
		.skip(offset)
		.limit(count)
		//short for execute
		.exec(function(err, hotels) {
			if (err) {
				console.log("Error Finding hotels");
				res
					.status(500)
					.json(err);
			} else {
			console.log("Found hotels", hotels.length);
			res
				.json(hotels);
			}
		});

};

module.exports.hotelsGetOne = function(req, res) {
	var hotelId = req.params.hotelId;

	console.log("GET hotelId", hotelId);

	Hotel 
		.findById(hotelId)
		.exec(function(err, doc) {
			var response = {
				status : 200,
				message : doc
			};
			if (err) {
				console.log("Error Finding hotels");
				response.status = 500;
				response.message = err;
			} else if(!doc) {
				response.status = 404;
				response.message = {
					"message" : "Hotel ID not found"
				};
			} 
			res 
  				.status(response.status)
  				.json(response.message);
  		});
};
// Split Array function that accepts input and returns output
var _splitArray = function(input) {
	var output;
	if (input && input.length > 0) {
		output = input.split(";");
	} else {
		output = [];
	} 
	return output;
};

module.exports.hotelsAddOne = function(req, res) {
	
	//Building the main function to create new documents
	// start with model and chain method to it
	Hotel
		//mongoose method for creating documents
		.create({
			//from request body
			name : req.body.name,
			description : req.body.description,
			stars : parseInt(req.body.stars, 10),
			services : _splitArray(req.body.services),
			photos : _splitArray(req.body.photos),
			currency : req.body.currency,
			location : {
				address : req.body.address,
				coordinates : [
				parseFloat(req.body.lng), 
				parseFloat(req.body.lat)
				]
			}
		}, function (err, hotel) {
			if (err) {
				console.log("Error creating hotel");
				res 
					.status(400)
					.json(err);
			} else {
				console.log("Hotel created", hotel);
				res 
					.status(201)
					.json(hotel);
			}
		});
		//add data to objects to send that create method
		//key = name of the path in mongoose
		//value = value we want to store document
};

module.exports.hotelsUpdateOne = function(req, res) {
	var hotelId = req.params.hotelId;

	console.log("GET hotelId", hotelId);

	Hotel 
		.findById(hotelId)
		.select("-reviews -rooms")
		.exec(function(err, doc) {
			if (err) {
				console.log("Error Finding hotels");
				res 	
					.status(500)
					.json(err);
					return;
			} else if(!hotel) {
				console.log("HotelId not found in database", hotelId);
				res 
					.status(404)
					.lson({
					"message" : "Hotel ID not found" + hotelId
				});
					return;
			} 
			
  				hotel.name = req.body.name;
  				hotel.description = req.body.description;
				hotel.stars = parseInt(req.body.stars,10);
				hotel.services = _splitArray(req.body.services);
				hotel.photos = _splitArray(req.body.photos);
				hotel.currency = req.body.currency;
				hotel.location = {
					address : req.body.address,
					coordinates : [
						parseFloat(req.body.lng), 
						parseFloat(req.body.lat)
					]
				};
				//STEP 3 updating
				hotel
					.save(function(err, hotelUpdated) {
						if(err) {
						//STEP 4 return response
							res 
								.status(500)
								.json(err);
						} else {
						res 
							.status(204)
							.json();

				}
			});
		
  });

};

module.exports.hotelsDeleteOne = function(req, res) {
	var hotelId = req.params.hotelId;

	Hotel 
		.findByIdAndRemove(hotelId)
		//callback will accept error object and data from teh hotel that has been deleted
		.exec(function(err, hotel) {
			if (err) {
				res
					.status(404)
					.json(err);
			} else {
				console.log("Hotel deleted, id:", hotelId);
				res 
					.status(204)
					.json();
			}
		});
};








