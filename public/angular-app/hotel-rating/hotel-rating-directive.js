// //angular 1
// angular.module('meanhotel').directive('hotelRating', hotelRating);

// function hotelRating() {
// 	return {
// 		restrict: 'E',
// 		template: '<span ng-repeat="star in vm.stars track by $index" class="glyphicon glyphicon-star">{{ star }}</span>',
// 		bindToController: true,
// 		controller: 'HotelController',
// 		controllerAs: 'vm',
// 		scope: {
// 			starts: '@'
// 		}
// 	}
// }


//instead use component closer to angular 2

angular.module('meanhotel').component('hotelRating', {
	binding: {
		stars: '*'
	},
	template: '<span ng-repeat="star in vm.stars track by $index" class="glyphicon glyphicon-star">{{ star }}</span>',
	controller: 'HotelController',
	controllerAs: 'vm'
});