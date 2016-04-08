'use strict';


var moduleName = 'modJobManager',
	dependencies = ['ui.router','ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 
	                'ui.grid.resizeColumns', 'ui.bootstrap', 'ngSanitize', 'textAngular', 
	                'modAlert', 'modDialog'];

var MOD = angular.module(moduleName, dependencies);

var JOB_API_URLS = {
	LIST_JOBS_URL		: '/api/job/list',
	VIEW_JOB_URL		: '/api/job/view',
	SEARCH_JOB_URL		: '/api/job/search',
	DELETE_JOB_URL 		: '/api/job/delete',
	PUBLISH_JOB_URL 	: '/api/job/publish',
	EXPIRE_JOB_URL 		: '/api/job/expire',
	CREATE_JOB_URL		: '/api/job/create',
	UPDATE_JOB_URL		: '/api/job/update'
};

var EDITOR_STATE_MODIFY_URL = "job.modify";
var EDITOR_STATE_NEW_URL    = "job.new";
var MANAGER_URL = "job.manage";

var CELL_OPERATION_TEMPLATE = 
	'<div class="btn-group">' + 
	'<a class="btn btn-primary" ng-click="grid.appScope.reeditJob(row)">编辑</a>' +
	'<a class="btn btn-danger" ng-click="grid.appScope.deleteJobDialog(row)">删除</a>' + 
	'<a class="btn btn-info" ng-show="row.entity.Status == \'SAVED\'" ng-click="grid.appScope.publishJob(row)">发布</a>' +	
	'<a class="btn btn-warning" ng-show="row.entity.Status == \'PUBLISHED\'" ng-click="grid.appScope.expireJob(row)">下架</a>' +	
	'</div>' ;

var modalDivSize = 'sm'; //or lg

MOD.factory("serviceJobApi", function($http, $interpolate){
	var defaultFunc = function(res){
		console.log(res);
	};
	return{
		listJobs: function(userId, curPage, pageSize, success, error){
			var requestUrl = JOB_API_URLS.LIST_JOBS_URL; 
			var payload = {params:{curPage:curPage, pageSize:pageSize, userId : userId}};
			$http.get(requestUrl, payload).success(success || defaultFunc).error(error || defaultFunc);
		},

		viewJob : function(jobId, success, error){
			var requestUrl = JOB_API_URLS.VIEW_JOB_URL;
			$http.get(requestUrl, {params : {jobId : jobId}}).success(success || defaultFunc).error(error || defaultFunc);
		},

		deleteJob : function(jobId, success, error){
			var payload = {params : {jobId:jobId}};
			var url = JOB_API_URLS.DELETE_JOB_URL; 
			$http.get(url, payload).success(success).error(error);
		},
		publishJob: function(jobId, success, error){
			var payload = {jobId :jobId};
			$http.post(JOB_API_URLS.PUBLISH_JOB_URL, payload)
				.success(success || defaultFunc).error(error || defaultFunc);
		},
		expireJob: function(jobId, success, error){
			var payload = {jobId :jobId};
			$http.post(JOB_API_URLS.EXPIRE_JOB_URL, payload)
				.success(success || defaultFunc).error(error || defaultFunc);
		},		
		createJob: function(theJob, success, error){
			var payload = theJob;
			$http.post(JOB_API_URLS.CREATE_JOB_URL, payload)
				.success(success || defaultFunc).error(error || defaultFunc);
		},
		updateJob: function(theJob, success, error){
			var payload = theJob;
			$http.post(JOB_API_URLS.UPDATE_JOB_URL, payload)
				.success(success || defaultFunc).error(error || defaultFunc);
		},		
	}
});

MOD.controller('ctrlJobManager',['$scope', '$state', '$uibModal', 'serviceDialog',
	'serviceAuthen', 'serviceJobApi', 'serviceAlertsManager', 'ALERT_CONST', 'uiGridConstants',
	function($scope, $state, $uibModal, serviceDialog,
	serviceAuthen, serviceJobApi, serviceAlertsManager, ALERT_CONST, uiGridConstants){

	$scope.jobList 	= [];
	$scope.total 	= 0;
	$scope.offset	= 0;
	$scope.servPages= 0;
	
	$scope.selectedJob = [];

	//set grid view in web page
	$scope.pagingOptions = {
			curPage 	: 1,
			pageSize 	: 25,
			pageSizes	: [25, 50, 100]
	};

	
    $scope.gridOptions = { 
        data					: 'jobList',
        //headerHeight 			: 30,
        enableColumnMenus		: false,
        enableColumnResizing	: true,
        enableRowSelection		: true,
        enableSelectAll			: true,
        //showGridFooter			: true,
        enablePagination		: true,
        useExternalPagination	: true,
        paginationPageSizes		: [25, 50, 75],
        paginationPageSize		: 25,
        enablePaginationControls: true,
    	enableHorizontalScrollbar 	: uiGridConstants.scrollbars.NEVER,
    	enableVerticalScrollbar 	: uiGridConstants.scrollbars.NEVER,
    	
    	//selectedItems				: $scope.selectedJob,
        columnDefs: [
             { field: 'CreatedTime', 	displayName: '发布日期', cellFilter: 'date:\'yyyy-MM-dd HH:mm:ss\'', 
            	 resizable:true, width:'*'}
            ,{ field: 'Company.Name', 	displayName: '公司', width:'*'}
            ,{ field: 'Position', 	displayName: '职位', width:'*'}
            ,{ field: 'Status', 		displayName: '状态', width:'*', enableColumnResizing : false}
    		,{  
    			name: '操作',
    			cellTemplate: CELL_OPERATION_TEMPLATE,
    			width: '*',
    			enableSorting: false,
    			enableColumnResizing : false
  			}
        ],      
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
              if (sortColumns.length == 0) {
            	  $scope.pagingOptions.sort = null;
              } else {
            	  $scope.pagingOptions.sort = sortColumns[0].sort.direction;
              }
              $scope.pageJobs($scope.pagingOptions.curPage, $scope.pagingOptions.pageSize);
            });
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            	if(newPage * pageSize > $scope.pagingOptions.pages){
            		$
            	}
            	$scope.pagingOptions.curPage = newPage;
            	$scope.pagingOptions.pageSize = pageSize;
            	$scope.pageJobs(newPage, pageSize);
            });
          }
    };
    
	$scope.pageJobs = function(curPage, pageSize){
		var success = function(res){
			console.log(res)
			//TODO: render in view
			$scope.jobList 	= res.docs;
			$scope.total 	= res.total;
			$scope.offset	= res.offset;
			$scope.limit	= res.limit;
			$scope.servPage	= res.pages;
			$scope.gridOptions.totalItems = $scope.total;
			
			$scope.pagingOptions.curPage = curPage;
		};
		var error = function(res){
			//TODO: alert something
			var msg = "获取列表失败。";
			serviceAlertsManager.addAlert(ALERT_CONST.TypeDanger, '失败！', msg);
		};

		serviceJobApi.listJobs(
			serviceAuthen.getUser()._id, curPage, pageSize, success, error);
	}

	$scope.newJob = function(gridRowEntry){
		$state.go(EDITOR_STATE_NEW_URL);
	};
	
	$scope.expireJob = function(gridRowEntry){
		var success = function(theJobInfo){
			gridRowEntry.entity.Status = theJobInfo.Status;
			var msg = "成功下架工作。";
			serviceAlertsManager.addAlert(ALERT_CONST.TypeSuccess, 'SUCCESS', msg);
		};

		var error = function(res){
			var msg = "下架职位失败。";
			serviceAlertsManager.addAlert(ALERT_CONST.TypeDanger, 'FAILURE', msg);
		};		
		
		serviceJobApi.expireJob(gridRowEntry.entity._id, success, error);
	};
	
	$scope.publishJob = function(gridRowEntry){
		var success = function(theJobInfo){
			gridRowEntry.entity.Status = theJobInfo.Status;
			var msg = "Succeed to publish article. It is able to read in public.";
			serviceAlertsManager.addAlert(ALERT_CONST.TypeSuccess, 'SUCCESS', msg);
		};

		var error = function(res){
			var msg = "Failed to publish article. Please Contact site admin.";
			serviceAlertsManager.addAlert(ALERT_CONST.TypeDanger, 'FAILURE', msg);
		};

		serviceJobApi.publishJob(gridRowEntry.entity._id, success, error);

	}

	$scope.reeditJob = function(gridRowEntry){
		var jobId = gridRowEntry.entity._id;
		$state.go(EDITOR_STATE_MODIFY_URL, {jobId : jobId});
	};

	$scope.deleteJobDialog = function(gridRowEntry){
		var yes = function(data){				
			$scope.deleteJob(gridRowEntry);
			
		};
		var no = function(data){
			console.log('Modal promise rejected. Reason: ', data);
		}
		serviceDialog.openConfirmDialog(
			'Dangerous!', 
			'Are you sure to DELETE ' + gridRowEntry.entity.Title + '?',
			yes,
			no
		);
	};

	$scope.deleteJob = function(gridRowEntry){
		var jobId = gridRowEntry.entity._id;
		var success = function(res){
			var toDeleteIndex = -1;
			angular.forEach($scope.jobList, function (job, index) {
			    if (job._id == jobId) {
			    	toDeleteIndex = index;
			    	//No possible to break; just only to skip the logic operation body
			    }
			});		

			if(toDeleteIndex >= 0){
				var msg = 'Successed to delete ' + gridRowEntry.entity.Title + '.';
				$scope.jobList.splice(toDeleteIndex, 1);
				serviceAlertsManager.addAlert(ALERT_CONST.TypeSuccess, 'SUCCESS', msg);
			}



		};
		var error = function(res){
			//alert("Failed to delete article.");
			serviceAlertsManager.addAlert(ALERT_CONST.TypeDanger, 'FAILED', '删除失败');
		};
		serviceJobApi.deleteJob(jobId, success, error);
	}

	function init(){
		$scope.pageJobs($scope.pagingOptions.curPage, $scope.pagingOptions.pageSize);
	}

	init();
}]);



MOD.constant('EDITOR_MODE', {
    NEW: 'EditorMode.New',
    MODIFY: 'EditorMode.Modify'
});

MOD.controller("ctrlJobEditor", ["$scope",'$stateParams', '$state', '$interval', 'serviceDialog','serviceAlertsManager', 
     "serviceAuthen", "serviceJobApi", "EDITOR_MODE", "ALERT_CONST", function($scope, $stateParams, $state, $interval, serviceDialog, 
	 serviceAlertsManager, serviceAuthen, serviceJobApi, EDITOR_MODE, ALERT_CONST) {

	var jobId = $stateParams.jobId ? parseInt($stateParams.jobId) : undefined;
	var mode = jobId ? EDITOR_MODE.MODIFY : EDITOR_MODE.NEW;
	console.log("editor is in " + mode);
	
	function init(){
		if (mode == EDITOR_MODE.MODIFY){
			//TODO: 从数据库里读出该job
			serviceJobApi.viewJob(jobId, function(res){
				$scope.theJob = res;
				$scope.theCompany = $scope.theJob.CompanyId;
			}, function(res){
				console.log("Load the job error");
			});
		}
		else{
			$scope.theJob = {
					Position	: 	null,
					PostedBy	: 	serviceAuthen.getUser().userId,
					CompanyId	:	null,
					ExpireDate	:	null,
					SalaryMin	:	0,
					SalaryMax	:	0,
					IsNegotiable:	true,
					Requirement	:	null,
					Description	:	null,
					Category	:	'unknown',
			    	Welfares		:	{
			    		Medical		:	false,
			    		DoublePay	:	false,
			    		MPF			:	false,
			    		Weekends	:	false
			    	},
					Email		:	null,
					Phone		:	null,
					WeChat		:	null,
					Status		: 	'SAVED'
					
			};		
		}
	}
	
	$scope.saveJob = function(operation){		
		var msg = operation ||  "保存";
		//if(!operation)	$scope.theJob.Status = "SAVED";
		var error = function(res){	
			msg += "失败！";
			serviceAlertsManager.addAlert(ALERT_CONST.TypeDanger, 'FAILURE', msg);
		};
		var success = function(res){	
			msg += "成功！";
			serviceAlertsManager.addAlert(ALERT_CONST.TypeSuccess, 'SUCCESS', msg);
			//TODO:跳转到工作列表
			$state.go(MANAGER_URL);
		};		
		if(mode == EDITOR_MODE.MODIFY){
			serviceJobApi.updateJob($scope.theJob, success, error);
		}
		else{
			serviceJobApi.createJob($scope.theJob, success, error);			
		}
	};
	
	$scope.publishJob = function(){		
		$scope.theJob.isPublished = true;
		$scope.theJob.Status = "PUBLISHED";
		$scope.saveJob("发布");
	};
	
	$scope.cancelEdit = function(){
		$state.go(MANAGER_URL);
	}
	
	init();
}]);




