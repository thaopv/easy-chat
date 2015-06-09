;(function() {
	'use strict';

	var app = angular.module('EasyChat', [
		'ngRoute',
		'ngResource'
	]);

	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			controller: 'controllers.Home',
			templateUrl: 'app/views/home.html',
			resolve: {
				token: tokenResolver
			}
		}).when('/signin', {
			controller: 'controllers.Session',
			templateUrl: 'app/views/signin.html'
		}).when('/forgotPassword', {
			controller: 'controllers.ForgotPassword',
			templateUrl: 'app/views/forgot-password.html'
		}).otherwise({
			redirectTo: '/'
		});
	}]).run(['$location', '$rootScope', function initilize($location, $rootScope) {
		$rootScope.$on('$routeChangeError', function handleRouteChangeError(event, next, previous, error) {
			if (error === 401) {
				$location.path('/signin');
				event.preventDefault();
			} else if (error === 402) {
				//todo: create page 404
				$location.path('/404');
				event.preventDefault();
			}
		});
	}]);

	var tokenResolver = function($location, Session) {
		return Session.get().$promise.then(function getSessionTokenDone(res) {
			return $location.path('/');
		}).catch(function handleSessionTokenError(err) {
			return $location.path('/signin');
		});
	};

	tokenResolver.$inject = ['$location', 'Session'];

	angular.element(window).ready(function() {
		angular.bootstrap(document.body, ['EasyChat']);
	});
})();
