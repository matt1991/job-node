'use strict';
var moduleName = 'modDialog',
	dependencies = ['ngDialog'];

var MOD = angular.module(moduleName, dependencies);

MOD.factory('serviceDialog', function(ngDialog){
	var DELETE_DIALOG_TEMPLATE = '<div class="ngdialog-message">'+
	    '    <h3>{{passedParams.title}}</h3>'+
	    '    <p>{{passedParams.msgBody}}</p> '+
	    '    <!--<p>Confirm can take a value. Enter one here for example and see the console output: <input ng-model="confirmValue" /></p>-->'+
	    '</div> '+
	    '<div class="ngdialog-buttons">'+
	    '    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm()">Confirm</button>'+
	    '    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">Cancel</button>'+
	    '</div>';
	return {
		openConfirmDialog : function(title, msgBody, yesFunc, noFunc){
			var dialogInstance = ngDialog.openConfirm({
	            template: DELETE_DIALOG_TEMPLATE,
	            plain: true,
	            resolve: {
	            	passedParams : function(){
	            		return {
  	            			title : title,
		            		msgBody : msgBody,

		            	}          		
	            	}

	            },	            
	            controller : function($scope, passedParams){
	            	$scope.passedParams = passedParams;
	            	$scope.doAnswer = function(boolValue){
	            		$scope.answer = boolValue;
            			return {answer : boolValue};
	            	};
	            }

/*	            ,preCloseCallback : function(value){
	            	console.log('preclose value', value);
	            	return false;
	            }*/
        	});
	        dialogInstance.then(yesFunc, noFunc);

	        return dialogInstance;
		}
	};

});

MOD.controller('ctrlServiceDialog', function(){

});