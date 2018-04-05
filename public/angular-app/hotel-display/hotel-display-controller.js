angular.module('meanhotel').controller('HotelController', HotelController);

function HotelController($route, $routeParams, $window, hotelDataFactory, AuthFactory, jwtHelper) {
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

	vm.isLoggedIn = function() {
		if (AuthFactory.isLoggedIn) {
			return true;
		} else {
			return false;
		}
	}

	//function to add review to hotel
	//from hotel.html
	vm.addReview = function() {

		var token = jwtHelper.decodeToken($window.sessionStorage.token);
		var username = token.username;
		var postData = {
			name: username,
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