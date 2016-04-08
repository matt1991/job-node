module.exports = function (context, contextPath){
	var app = context.app;
	//setup the submodules api route
	require('./routes/authenApi')(context, "/api/authen");
    require('./routes/jobApi')(context, "/api/job");
    //setup the default route
};


