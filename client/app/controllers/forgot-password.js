;(function() {
	'use strict';

	var ForgotPasswordCtrl = function($scope, $location, Session) {
		$scope.error = false;
		var session = $scope.session = new Session();

		$scope.forgotPassword = function() {
			session.$forgotPassword().then(function onForgotPasswordDone(data) {
				console.log(data);
				$location.path('/');
			}).catch(function onForgotPasswordFailed(err) {
				$scope.error = true;
			});
		};
	};

	ForgotPasswordCtrl.$inject = ['$scope', '$location', 'Session'];
	angular.module('EasyChat').controller('controllers.ForgotPassword', ForgotPasswordCtrl);
})();
