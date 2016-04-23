/*
 * this module is providing the user login/logout
 * handle the url under the /api/authen
 */

module.exports = function(context, contextPath){
	var app = context.app;

 	app.get(contextPath + "/*", function(req, res){
 		// const template = require('./index.jade');
 		// const data = { title: '', description: '', css: '', body: '', entry: '/client/main.js' };
 		// console.log(template);
 		// res.status(statusCode);
   //    	res.send(template(data));
   		res.render('./index', {title: 'title', description: 'description', css: '', body: '', entry: '/main.js' });
 	});




    return app;
}