
var moduleName = 'modAuthen',
	dependencies = ['ngCookies'];

var modAuthen = angular.module(moduleName, dependencies);

modAuthen
.constant('AUTH_EVENTS', {
    LoginSuccess: 'AuthEvent.LoginSuccess',
    LogoutSuccess: 'AuthEvent.LogoutSuccess',    
    Authenticated: 'AuthEvent.Authenticated',
    NotAuthenticated: 'AuthEvent.NotAuthenticated',
    NotAuthorized: 'AuthEvent.NotAuthorized',
    SessionTimeout: 'AuthEvent.SessionTimeout'
})
.constant('AUTH_URL',{
	REGISTER : "/api/authen/register",
	LOGIN : "/api/authen/login",
	LOGOUT: "/api/authen/logout",

})
.factory('serviceAuthen', function($rootScope, $http, $cookieStore, AUTH_EVENTS, AUTH_URL){
    function onLoginSuccess(user) {        
        console.log(AUTH_EVENTS.LoginSuccess, user);
        updateUser(user);
        $rootScope.$broadcast(AUTH_EVENTS.LoginSuccess);
    }  
      
    function onLogoutSuccess() {
        console.log(AUTH_EVENTS.LogoutSuccess);
        updateUser(null);
        $rootScope.$broadcast(AUTH_EVENTS.LogoutSuccess);
    }

    function onAuthenticated(user) {
        console.log(AUTH_EVENTS.Authenticated);
        updateUser(user);
        $rootScope.$broadcast(AUTH_EVENTS.Authenticated);
    }

    function onNotAuthenticated() {
        if ($rootScope.loginedUser!=null) {
            console.log(AUTH_EVENTS.SessionTimeout);
            updateUser(null);
            $rootScope.$broadcast(AUTH_EVENTS.SessionTimeout);
        } else {
            console.log(AUTH_EVENTS.NotAuthenticated);
            updateUser(null);
            $rootScope.$broadcast(AUTH_EVENTS.NotAuthenticated);        
        }
    }

    function onNotAuthorized(user) {
        console.log(AUTH_EVENTS.NotAuthorized);
        updateUser(user);
        $rootScope.$broadcast(AUTH_EVENTS.NotAuthorized);
    }    
    
    function updateUser(user) {
        $rootScope.loginedUser = user;
        $cookieStore.put('loginedUser', user);
    }

    return {
        getUser: function() {
            var aUser = $rootScope.loginedUser ? 
                $rootScope.loginedUser: $cookieStore.get('loginedUser');
            if(!aUser) {
            	console.log('user is not online.');
            	//onNotAuthenticated(aUser);
            }
            return aUser;
        }, 
        isAuthorized: function(accessRights) {
            var authorized = true;              
            return authorized;
        },        
        register: function(user, success, error) {
            $http.post(AUTH_URL.REGISTER, user).success(function(res) {
                onLoginSuccess(res);   
                success(res);
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post(AUTH_URL.LOGIN, user).success(function(res){
                onLoginSuccess(res);
                success(res);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post(AUTH_URL.LOGOUT).success(function(){
                onLogoutSuccess();
                success();
            }).error(error);
        },
        isLogined : function(){
            $rootScope.loginedUser = $cookieStore.get("loginedUser");
            return !$rootScope.loginUser;
        },

        isAuthEvent: function(status) {
            if (status==401) {
                onNotAuthenticated();
                return true;
            } else if (status==403) {
                onNotAuthorized();
                return true;
            } else {
                return false;
            }
        },
    };
})
.controller('ctrlAuthen', function($scope, $rootScope, $location, serviceAuthen, AUTH_EVENTS) {
	$scope.user = null;
    $scope.login = function(user) {
        var aUser = user || $scope.user;
        serviceAuthen.login($scope.user, function(user) {
            $location.path("/job/manage");
        }, function(err) {
            $scope.errorMessages = "Login Failed!";
        });
    };
    
    $scope.register = function() {
    	//TODO: check the passwords are same
    	if ($scope.user.password != $scope.user.confirmPassword){
    		console.log("两次密码不相符。");
    		return;
    	}
        serviceAuthen.register({
                Password:$scope.user.password,
                Email:$scope.user.email
        }, function(user) {
        	//TODO: ask user to active account by url sent to his email
            $scope.login(user);
            $location.path("/job/manage");//'/#/public/search//');
        }, function(err) {
            if (err && err.message!=undefined) {
                $scope.errorMessages = err.message;
            } else {
                $scope.errorMessages = "Register Failed!";
            }
        });
    };
    
    $scope.logout = function(){
    	$rootScope.loggedIn = false;
    	$location.path('/authen/login');
    };

    function init(){
        if(!serviceAuthen.isLogined()){
        	$location.path('/');
        }
    }
});