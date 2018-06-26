var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var mongoosastic = require("mongoosastic");

//Schema
var ProductSchema = new Schema({
	category : {
		type : Schema.Types.ObjectId,
		ref : 'Category',
	},
	name : {
		type : String,
		es_type: 'text'
	},
	price : Number,
	image : {
		type : String,
		es_type: 'text'
	} 
});
ProductSchema.plugin(mongoosastic, {
	hosts : [
	'localhost:9200'
	]
})

module.exports = mongoose.model('Product', ProductSchema);