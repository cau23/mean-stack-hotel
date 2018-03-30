angular.module('meanhotel').controller('HotelController', HotelController);

function HotelController($route, $routeParams, hotelDataFactory) {
	var vm = this;
	var id = $routeParams.id;
	hotelDataFactory.hotelDisplay(id).then(function(response) {
		vm.hotel = response.data;
		vm.stars = _getStarRating(response.data.stars);
	});
	//change vm stars to hold an array instead of numbers
	//helper function
	function _getStarRating(stars) {
		return new Array(stars);
	}

	//function to add review to hotel
	//from hotel.html
	vm.addReview = function() {
		var postData = {
			name: vm.name,
			rating: vm.rating,
			review: vm.review
		};
		if (vm.reviewForm.$valid) {
			hotelDataFactory.postReview(id, postData).then(function(response) {
				//if post was successful - reload the route
				if (response.status === 201) {
					$route.reload();
				}
			}).catch(function(error) {
				console.log(error);
			});
		} else {
			vm.isSubmitted = true;
		}
	};
}