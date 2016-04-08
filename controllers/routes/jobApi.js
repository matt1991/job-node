/**
 * 说明：应聘者浏览API
 */

module.exports = function(context, contextPath){
    var app  = context.app;
    var JobModel = require('../../models/Job.js');

	/*******************************************/
    /* The inner business operation */
    /*******************************************/	 

 	//get the list of a publiser's articles
 	app.get(contextPath + "/list", function(req, res){
		curPage		= parseInt(req.query.curPage) || 0, 
		pageSize	= parseInt(req.query.pageSize) || 100;
		userId		= req.session.userId;
		console.log(req.query);
		var	fields = '';
		var filter = null;
		
		if(userId){//user的api
			filter = {
					Status		: {$ne : 'DELETED'},
					PostedBy	: userId
			};
		}
		else{	//公共api
			filter = {
					Status		: 'PUBLISHED',
					//IsPublished : true,
					//IsExpired	: false,
					//IsDeleted	: false,
			};
		}
		
		console.log(userId, filter);
		
		var pageOptions = {
				select	: 	fields,
				sort	: 	{CreatedTime:-1},
				page	:	curPage,
				//offset	: 	curPage,
				limit 	:	pageSize
			};
		
		JobModel.paginate(filter, pageOptions, function(err, result){
 			if(err){
 				return res.send(503, err);
 			}
 			else{
 				return res.send(result);
 			}
 		});
 	});
 	
 	app.get(contextPath + "/search", function(req, res){
 		var company		= req.query.company,
 		jobName			= req.query.jobName;
 		
 		var fields = '';
		var filter = {};
		
		JobModel.FindAll(filter, function(err, result){
 			if(err){
 				return res.send(503, err);
 			}
 			else{
 				return res.send(result);
 			}
 		});		
				
 	});
 	
 	app.get(contextPath + "/view", function(req, res){
 		var jobId		= req.query.jobId;
 		
 		var fields = '';
		var filter = {'_id' : jobId};
		
		JobModel.findOne(filter, function(err, result){
 			if(err){
 				return res.send(503, err);
 			}
 			else{
 				return res.send(result);
 			}
 		});		
				
 	});
 	
 	app.post(contextPath + "/create", function(req, res){
 		var userId = req.session.userId;
 		var newJob = new JobModel(req.body);
 		newJob.PostedBy = userId;
 		newJob.save(function(err, aJob){
 			if(err){
 				console.log(err, aJob);
 				res.send(503, err);
 			}
 			else{
 				res.send(aJob);
 			}
 		});
							
 	});
 	
 	app.post(contextPath + "/update", function(req, res){
 		var jobId		= req.body._id;
 		
 		var fields = '';
 		var filter = {"_id" : jobId, PostedBy : userId};
		console.log(filter);
		var options = {multi : true};
		JobModel.update(filter, req.body, options, function(err, result){
 			if(err){
 				return res.send(503, err);
 			}
 			else{
 				//TODO: 更新字段并保存
 				return res.send(result);
 			}
 		});	
				
 	});
 	
 	app.get(contextPath + "/delete", function(req, res){
 		var jobId		= req.query.jobId;
 		var userId		= req.session.userId;
		var filter = {'_id' : jobId, PostedBy : userId};
		
		JobModel.findOne(filter, function(err, result){
 			if(err){
 				return res.status(503).send(err);
 			}
 			else{
 				result.IsDeleted = true;
 				result.IsExpired = true;
 				result.Status = 'DELETED';
 				result.save(function(err, result){
 					return res.status(200).send();
 				});
 			}
 		});		
				
 	});
 	
 	app.post(contextPath + "/publish", function(req, res){
 		var userId = req.session.userId;
 		var jobId  = req.body.jobId;
 		var filter = {"_id" : jobId, PostedBy : userId};
 		
		JobModel.findOne(filter, function(err, result){
 			if(err || !result){
 				return res.status(503).send(err);
 			}
 			else{
 				result.IsPublished = true;
 				result.Status = 'PUBLISHED';
 				result.save(function(err, result){
 					return res.status(200).send(result);
 				});
 			}
 		});									
 	});
 	
 	app.post(contextPath + "/expire", function(req, res){
 		var userId = req.session.userId;
 		var jobId  = req.body.jobId;
 		var filter = {"_id" : jobId, PostedBy : userId};
 		
		JobModel.findOne(filter, function(err, result){
 			if(err || !result){
 				return res.status(503).send(err);
 			}
 			else{
 				result.IsExpired = true;
 				result.Status = 'EXPIRED';
 				result.save(function(err, result){
 					return res.status(200).send(result);
 				});
 			}
 		});									
 	});
 	
 	return app;
}