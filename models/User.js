// Export some model methods
module.exports = function() {
    var mongoose = require('mongoose'),
        autoIncrement = require('mongoose-auto-increment'),        
        mongoosePaginate = require('mongoose-paginate');
		
    var Schema   = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
     
    var schema = new Schema({
    	//HashId			:	ObjectId,
    	LoginName		:	String,
        Name			: 	String,
        Password		: 	String,
        Role			:	{type:Number, ref:'Role'}, //用户角色， JOB_POSTER， JOB_SEEKERTODO：以后可能用dbid作辨识
        Contact			:	[String],
        Email			:	[String],
        CompanyId		:	{type:Number, ref:'Company'},	//所属公司id
        
        AuthenToken		:	String,
        TokenExpire		:	Date,

        IsActived		: 	{ type: Boolean, 'default': true },
        LastLoginedTime	: 	{ type: Date, 'default': Date.now },
        CreatedTime		: 	{ type: Date, 'default': Date.now },
        ModifiedTime	: 	{ type: Date, 'default': Date.now }
    });

    var collectionName = 'table_user';
    schema.plugin(autoIncrement.plugin, {
        model: collectionName,
        startAt: 1
    });
    schema.plugin(mongoosePaginate);
	schema.set('autoIndex', false);
    schema.index({
		LoginName:'text'
	});
	
    var UserModel = mongoose.model(collectionName, schema);
    UserModel.ensureIndexes( function(err) { 
		if (err) { 
		  console.error(err); 
		} 
	});	
	return UserModel;
}();