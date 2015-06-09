;(function() {
	'use strict';

	var SessionCtrl = function($scope, $location, Session) {
		$scope.error = false;
		var session = $scope.session = new Session();

		$scope.signin = function() {
			session.$save().then(function onSignInDone(data) {
				$location.path('/');
			}).catch(function onSignInFailed(err) {
				$scope.error = true;
			});
		};

		$scope.register = function() {
			session.$register().then(function onRegisterDone(data) {
				$location.path('/');
			}).catch(function onRegisterFailed(err) {
				$scope.error = true;
			});
		};
	};

	SessionCtrl.$inject = ['$scope', '$location', 'Session'];
	angular.module('EasyChat').controller('controllers.Session', SessionCtrl);
})();
