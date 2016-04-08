var http = require('http');
	express = require('express'),
  	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	mongoeseAutoIncrement = require('mongoose-auto-increment'),
	fs = require('fs'),
	cookieParser = require('cookie-parser'),
    session = require('express-session'),
	sessionMongoStore = require('connect-mongo')(session),
	path = require('path'),
	settings = require("./settings.js");

function startHTTPServers() {
	var servers = new Array();
	var errorhandler = function errorhandler(err, req, res, next) {};
						
	var httpServerConfig = settings.get('public-server');
	if (httpServerConfig!=null) {
		var app = express();
		var httpServer  = http.createServer(app);
		servers.push(httpServer);
		
		var sessionStore =  new sessionMongoStore({
								url: httpServerConfig['session-store'],
								auto_reconnect: true
							});
		
		var context = {
			app: app,
			settings : settings,
			cookieParser: cookieParser(httpServerConfig['cookie-secret']),
			errorhandler: errorhandler,	
			express: express,
			mongoose: mongoose,
			session: session,
			sessionKey: 'session_id',
			sessionStore: sessionStore,
			path: path
		};

		//TODO: config the basic express app;
		app.set('views', __dirname + '/views');
		app.engine('jade', require('jade').__express);
		app.set('view engine', 'jade');

		app.use("/public", express.static(__dirname + '/public'));
		app.use("/client", express.static(__dirname + '/client'))
		app.use(bodyParser.json({limit: '1mb'}));
		app.use(bodyParser.urlencoded({extended: true}));
		app.use(context.cookieParser);
		app.use(context.errorhandler);
	    app.use(context.session({
	        cookie: { path: '/', httpOnly: false, maxAge: null},
	        key: context.sessionKey, 
	        store: context.sessionStore
		}));

		//TODO: init submodules, create handler routes
		require('./controllers/routesInit')(context);


		var httpPort = httpServerConfig['http-port'];
		httpServer.listen(httpPort);
		console.log("Public server listens port "+httpPort+".");								
	}		


}

function startMongoDB(){

	mongoeseAutoIncrement.initialize(mongoose.connect(settings.get('database')));		
	mongoose.set('debug', false);
	mongoose.connection.on('connected', function() {
		console.log('Mongoose default connection open to ' + settings.get('database'));        
		startHTTPServers();

	});
	mongoose.connection.on('disconnected', function() {
		console.log('Mongoose default connection disconnected');
	});
	mongoose.connection.on('error',function(err) {
		console.error('Mongoose default connection error: ' + err);
	});	

	process.on('SIGINT', function() {
		mongoose.connection.close(function() {
			console.log('Mongoose default connection disconnected through app termination');
			process.exit(0);
		});
	});

}

startMongoDB();

