// Export some model methods
module.exports = function() {
    var mongoose = require('mongoose'),
        autoIncrement = require('mongoose-auto-increment'),        
        mongoosePaginate = require('mongoose-paginate');
		
    var Schema   = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
     
    var schema = new Schema({
        HashId			: 	ObjectId,    
        OwnerId			:	{type:Number, ref:'User'},               
        FileLocation	: 	String,
        Binary			: 	Buffer,
        IsDeleted: { type: Boolean, 'default': false },        
        CreatedTime: { type: Date, 'default': Date.now },
        ModifiedTime: { type: Date, 'default': Date.now }
    });

    var collectionName = 'table_resume';
    schema.plugin(autoIncrement.plugin, {
        model: collectionName,
        startAt: 1
    });
    schema.plugin(mongoosePaginate);
	schema.set('autoIndex', false);
    schema.index({
		PublisherId : 1
    });
	
    var ResumeModel = mongoose.model(collectionName, schema);
    ResumeModel.ensureIndexes( function(err) { 
		if (err) { 
		  console.error(err); 
		} 
	});	
	return ResumeModel;
}();