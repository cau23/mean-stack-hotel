angular.module('meanhotel').controller('LoginController', LoginController);

function LoginController($http, $location, $window, AuthFactory) {
	var vm = this;
	//helper function to track if the user is logged in
	vm.isLoggedIn = function() {
		if (AuthFactory.IsloggedIn) {
			return true;
		} else {
			return false;
		}
	};
	//log in and log out functions
	vm.login = function() {
		//user object we send to backend
		if (vm.username && vm.password) {
			var user = {
				username: vm.username,
				password: vm.password
			};
			//log the user in
			$http.post('/api/users/login', user).then(function(response) {
				//store token is the session storage of browser
				if (response.data.success) {
					$window.sessionStorage.token = response.data.token;
					AuthFactory.isLoggedIn = true;
				}	
			}).catch(function(error) {
				console.log(error);
			})

		}
	}

	vm.logout = function() {
		AuthFactory.isLoggedIn = false;
		delete $window.sessionStorage.token;
		$location.path('/');

	}
	//create different style to active tabs in
	//navigation-directive.js file
	vm.isActiveTab = function(url) {
		var currentPath = $location.path().split('/')[1];
		return (url === currentPath ? 'active' : '');
	}
}