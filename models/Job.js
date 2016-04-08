
/**
 * 说明： 招聘岗位工作
 */


// Export some model methods
module.exports = function() {
    var mongoose = require('mongoose'),
        autoIncrement = require('mongoose-auto-increment'),        
        mongoosePaginate = require('mongoose-paginate');
		
    var Schema   = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
    
     
    var schema = new Schema({
    	//HashId			:	ObjectId,
    	Position		:	String,							//职位名称，TODO：从db里选？
    	PostedBy		:	{type:Number, ref:'table_user'},		//工作发布者
    	CompanyId		:	{type:Number, ref:'table_company'},
    	Company			:	{
        	Name				:   String,
        	Website				:	String,
        	Description			:	String,
        	Location			:	String,
    	},
    	ExpiredDate		:	String,							//有效日期
        SalaryMin		: 	Number,
        SalaryMax		: 	Number,
        IsNegotiable	:	Boolean,						//面谈
        Requirement		:	String,
        Description		:   String,
        Category		: 	String,						//分类， TODO：关于分类实现，得细细琢磨
        AddedFields		:	{
        	Key			:	String,
        	Value		:	String
    	},
    	Welfares		:	{
    		Medical		:	Boolean,
    		DoublePay	:	Boolean,
    		MPF			:	Boolean,
    		Weekends	:	Boolean
    	},
        
    	ContactName		:   String,	
    	Email			:	String,						//投递方式
    	Phone			:	String,						//投递方式
    	WeChat			:	String,						//投递方式
        JobSeekers		:	[{type:Number, ref:'User'}],	//投简历的用户id集合
        
        Status			: 	{type: String, 'defalut': 'SAVED'},	//SAVED， PUBLISHED， EXPIRED， DELETED
        IsPublished		: 	{ type: Boolean, 'default': true },
        IsDeleted		: 	{ type: Boolean, 'default': false },
        IsExpired		: 	{ type: Boolean, 'default': false },
        publishedDate	: 	Date,
        ExpiredDate		: 	Date,
        CreatedTime		: 	{ type: Date, 'default': Date.now },
        ModifiedTime	: 	{ type: Date, 'default': Date.now }
    });

    var collectionName = 'table_job';
    schema.plugin(autoIncrement.plugin, {
        model: collectionName,
        startAt: 1
    });
    schema.plugin(mongoosePaginate);
	schema.set('autoIndex', false);
    schema.index({
    	Position:'text'
	});
	
    var JobModel = mongoose.model(collectionName, schema);
    JobModel.ensureIndexes( function(err) { 
		if (err) { 
		  console.error(err); 
		} 
	});	
	return JobModel;
}();