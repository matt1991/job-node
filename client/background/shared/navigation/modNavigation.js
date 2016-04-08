'use strict';

var moduleName = 'modNavigation',
	dependencies = ['modAuthen'];

var modNavigation = angular.module(moduleName, dependencies);

modNavigation.controller('ctrlGeneralNav', function($scope, $rootScope, $location, $timeout, serviceAuthen, AUTH_EVENTS) {
    $scope.loginedUser = serviceAuthen.getUser();
    $scope.logout = function() {
        serviceAuthen.logout(function() {
            $location.path('/');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };

    // Authentication related events
    $scope.$on(AUTH_EVENTS.LoginSuccess    , handleAuthEvent);
    $scope.$on(AUTH_EVENTS.loginFailed     , handleAuthEvent);
    $scope.$on(AUTH_EVENTS.Authenticated   , handleAuthEvent);
    $scope.$on(AUTH_EVENTS.NotAuthenticated, handleAuthEvent);
    $scope.$on(AUTH_EVENTS.SessionTimeout  , function(e) {
        handleAuthEvent(e);
        $location.path('/public/login');
    });

    function handleAuthEvent(e) {
        $scope.loginedUser = serviceAuthen.getUser();
        if ($scope.loginedUser==null) {
            $rootScope.$broadcast(PRESENCE_EVENTS.Disconnect);
        }
    }
    function init(){
    	if($scope.loginedUser == null){
    		$location.path('/public/login');
    	}
    }
    init();
})
.directive('header', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: "partials/navigation/header.html",
        controller: 'ctrlGeneralNav'
    }
})
.directive('footer', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: "partials/navigation/footer.html"
    }
});
