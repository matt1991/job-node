/**
 * 说明：用户的类型元数据
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
    	Code				:   String,
    	Description			:	String
    });

    var collectionName = 'table_user_role';
    schema.plugin(autoIncrement.plugin, {
        model: collectionName,
        startAt: 1
    });
    schema.plugin(mongoosePaginate);
	schema.set('autoIndex', false);
	
    var RoleModel = mongoose.model(collectionName, schema);
    RoleModel.ensureIndexes( function(err) { 
		if (err) { 
		  console.error(err); 
		} 
	});	
	return RoleModel;
}();