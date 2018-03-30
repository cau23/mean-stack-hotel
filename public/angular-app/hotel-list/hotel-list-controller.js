//lecture 45 Building SPA part 2 6:00
angular.module('meanhotel').controller('HotelsController', HotelsController);

function HotelsController(hotelDataFactory) {
	var vm = this;
	vm.title = 'MEAN Hotel App';
	hotelDataFactory.hotelList().then(function(response) {
		//console.log(response);
		vm.hotels = response.data;
	});
}