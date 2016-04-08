'use strict';

var moduleName = 'modAlert',
	dependencies = ['ui.bootstrap'];

var MOD = angular.module(moduleName, dependencies);
var templateStr = "<div class='alert alert-{{alertData.type}}' " +
        "ng-show='alertData.message' role='alert' data-notification='{{alertData.status}}'>" +
        "{{alertData.message}}</div>"

MOD.constant('ALERT_CONST', {
    'TypeDanger' : 'danger',
    'TypeInfo' : 'info',
    'TypeWarning' : 'warning',
    'TypeSuccess' : 'success',
    'Timeout' : 1000 //ms
});

MOD.factory('serviceAlertsManager', function(ALERT_CONST) {
    var alerts = [];
    return {
        getAlerts: function(){
            return alerts;
        },
        addAlert: function(type, title, message) {
            alerts.push({title:title, message:message, type:type});
        },
        clearAlerts: function() {
            alerts = [];
        },
        removeAlert: function(index){
            alerts.splice(index, 1);
        },

        ALERT_CONST : ALERT_CONST
    };
});


MOD.directive('alerter', function($timeout, serviceAlertsManager, ALERT_CONST){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'partials/alert/alerter.html',
    link: function($scope, element, attrs) {
        $scope.timeout = ALERT_CONST.Timeout;
        $scope.getAlerts = function(){ return serviceAlertsManager.getAlerts();};
        $scope.closeAlert = function(index){serviceAlertsManager.removeAlert(index)};
    }
  }
});



