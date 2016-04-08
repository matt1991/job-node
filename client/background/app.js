'use strict';

var appName = 'appEOGPoster',
	dependencies = ['ui.router', 'ui.grid','ui.bootstrap', 'ngDialog',
    'modDialog', 'modAlert', 'modAuthen', 'modNavigation', 'modJobManager'];

var APP = angular.module(appName, dependencies);
APP.config(function($stateProvider, $urlRouterProvider){
    //which is contain the ui-view to expand its child view
    var rootPageUrl = 'partials/navigation/ui-view.html'; 
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: rootPageUrl
        });

    $stateProvider
         .state('authen', {
            url: '/authen',
            templateUrl: rootPageUrl
        })       
        .state('authen.login', {
            url: '/login',
            templateUrl: 'partials/authen/login.html',
            controller : 'ctrlAuthen'
        })        
        .state('authen.register', {
            url: '/register',
            templateUrl: 'partials/authen/register.html',
            controller: 'ctrlAuthen',
            data: {}
        });

    $stateProvider
        .state('job', {
            url: '/job',
            templateUrl: rootPageUrl,
            data: { 
                accessRights: []
            }
        })
        .state('job.new', {
            url: '/new',
            templateUrl: 'partials/jobManager/editor.html',
            controller: 'ctrlJobEditor',
        })
        .state('job.modify',{
            url : '/modify/:jobId',
            templateUrl: 'partials/jobManager/editor.html',
            controller: 'ctrlJobEditor',
        })
        .state('job.manage', {
            url: '/manage',
            templateUrl: 'partials/jobManager/index.html',
            controller: 'ctrlJobManager',
            data: { 
                accessRights: ["publisher"]
            }
        });      


    $urlRouterProvider.otherwise("/index");
});


