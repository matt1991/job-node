/*
 * this module is providing the user login/logout
 * handle the url under the /api/authen
 */

module.exports = function(context, contextPath){
	var app = context.app;
	var UserModel = require('../../models/User.js');
	var keyGenerator = require('crypto').createHash('sha1');
	
	//register a publisher
 	app.post(contextPath + "/register", function(req, res){
 		var generatedKey = keyGenerator.digest(keyGenerator.update(req.body.Password));
 		var hashPassword = req.body.Password;
 		var NewUser = new UserModel(req.body);
 		var today = new Date(), diff = 10 * 24 * 60 * 60 * 1000;
 		NewUser.LoginName = req.body.Email;
 		NewUser.Password = hashPassword;
 		NewUser.AuthenToken = generatedKey;
 		NewUser.TokenExpire = new Date(today.getTime() + diff);
 		var filter = {"LoginName" : NewUser.LoginName};
 		
 		UserModel.findOne(filter, function(err, existed){
 			if(!err){
 				if(!existed){
 			 		NewUser.save(function(err, aUser){
 			 			if(err){
 			 				console.log(err);
 			 				res.status(503).send(err);
 			 			}
 			 			else{
 			 				res.send(aUser);
 			 			}
 			 		});				
 				}
 				else{
 					res.send(401, "The User existed");
 				}
 			}
 			else{
 				res.send(503, err);
 			}
 		});
        

 	});

    app.post(contextPath +'/login', function(req, res) {
        console.log(req.body);
    	var hashedPasswd = req.body.Password;
        var loginName = req.body.LoginName;
        if (loginName === undefined || hashedPasswd === undefined){
            res.send(401, "The fileds mustn't be empty.");
        }
        else{
        	var filter = {LoginName:loginName, Password:hashedPasswd};
			UserModel.findOne(filter, function(err, aUser){
				if(err || aUser == null){
					console.log(err);
					res.send(401, 'incorrect password or login name.');
				}
				else{
	                req.session.regenerate(function () {
	                    console.log(aUser);
	                    req.session.userId = aUser._id;
						aUser.Password = '';
						res.json(200, aUser);	
	                });					
				
				}
			});       	
        }

    });

    app.post(contextPath+'/logout', function(req, res) {
        req.session.destroy(function () {
            res.send(200);
        });
    });    
    
    app.get(contextPath+'/active', function(req, res) {
    	
    });  

    return app;
}