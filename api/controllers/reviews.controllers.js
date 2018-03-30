//mongoose now in our controller
var mongoose = require('mongoose');
//reference to our model
//use this model inside contollers to interact with database
//All interactions with data in mongoose all goes through the model
var Hotel = mongoose.model('Hotel');

//place holders so controllers won't fail

//GET all reviews for a hotel
module.exports.reviewsGetAll = function(req, res) {
	var hotelId = req.params.hotelId;
	console.log('GET reviews for hotelId', hotelId);

	Hotel 
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, doc) {
      console.log("Returned doc", doc);
			res
  				.status(200)
  				.json( doc.reviews );
  			
  			if (err) {
  				console.log("Error finding hotel");
  				response.status = 500;
  				reponse.message = err;
  			} else if (!doc) {
  				console.log("Hotel ID not found in database", id);
  				response.status = 404;
  				response.message = {
  					"message" : "Hotel ID not found " + id
  				};
  			} else {
  				response.message = doc.reviews ? doc.reviews : [];
  			};
  			res 
  				.status(response.status)
  				.json(response.message);
  		});
};
//GET single review of hotel
module.exports.reviewsGetOne = function(req, res) {
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;
	console.log('GET reviewId ' + reviewId + ' for hotelId ' + hotelId);

	Hotel 
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, hotel) {
			var response = {
				status : 200,
				message : {}
			};
			if (err) {
				console.log("Error finding hotel");
				response.status = 500;
				response.message = err;
			} else if (!hotel) {
				console.log("Hotel id not found in database", id);
				response.status = 404;
				response.message = {
					"message" : "Hotel ID not found " + id
				};
			} else {
				//Get the review - will get specific review we are looking for
				response.message = hotel.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!response.message) {
        	response.status = 404;
        	response.message = {
        		"message" : "Review ID not found " + reviewId
        	};
        }
			}
			res 
  				.status(response.status)
  				.json(response.message);
  		});
};

var _addReview = function(req, res, hotel) {

	hotel.reviews.push({
		name : req.body.name,
		rating : parseInt(req.body.rating, 10),
		review : req.body.review
	});

	hotel.save(function(err, hotelUpdated) {
		if (err) {
			res 
				.status(500)
				.json(err);
		} else {
			res 
				.status(201)
				.json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]);
		}
	});
	
};

module.exports.reviewsAddOne = function(req, res) {

	var hotelId = req.params.hotelId;

	console.log('GET hotelId', hotelId);

	Hotel 
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, doc) {
			var response = {
  				status : 200,
  				message : []
  		};
  		if (err) {
  				console.log("Error finding hotel");
  				response.status = 500;
  				reponse.message = err;
  			} else if (!doc) {
  				console.log("HotelID not found in database", id);
  				response.status = 404;
  				response.message = {
  					"message" : "Hotel ID not found " + id
  				};
        }
  			if (doc) {
          _addReview(req, res, doc);
        } else {
  			  res 
  					.status(response.status)
  					.json(response.message);
        }
  		});


};

module.exports.reviewsUpdateOne = function(req, res) {
  var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        console.log("Hotel id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + id
        };
      } else {
        // Get the review
        thisReview = hotel.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        thisReview.name = req.body.name;
        thisReview.rating = parseInt(req.body.rating, 10);
        thisReview.review = req.body.review;
        hotel.save(function(err, hotelUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });

};

module.exports.reviewsDeleteOne = function(req, res) {
var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        console.log("Hotel id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + id
        };
      } else {
        // Get the review
        thisReview = hotel.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        //model instance
        hotel.reviews.id(reviewId).remove();
        hotel.save(function(err, hotelUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });

};
