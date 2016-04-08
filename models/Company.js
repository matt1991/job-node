/**
 * 说明：公司信息
 * 默认:
 * 		ROLE_HR				公司的正式代表
 * 		ROLE_JOB_SEEKER		应聘者
 * 		ROLE_JOB_POSTER		工作发布者（非正式）
 */

module.exports = function() {
    var mongoose = require('mongoose'),
        autoIncrement = require('mongoose-auto-increment'),        
        mongoosePaginate = require('mongoose-paginate');
		
    var Schema   = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
     
    var schema = new Schema({
    	//_id				:	‘system generated’；
    	Name				:   String,
    	Website				:	String,
    	Description			:	String,
    	
        CreatedTime		: 	{ type: Date, 'default': Date.now },
        ModifiedTime	: 	{ type: Date, 'default': Date.now }    	
    });

    var collectionName = 'table_company';
    schema.plugin(autoIncrement.plugin, {
        model: collectionName,
        startAt: 1
    });
    schema.plugin(mongoosePaginate);
	schema.set('autoIndex', false);
    schema.index({
    	Name:'text'
	});
    
    var CompanyModel = mongoose.model(collectionName, schema);
    CompanyModel.ensureIndexes( function(err) { 
		if (err) { 
		  console.error(err); 
		} 
	});	
	return CompanyModel;
}();