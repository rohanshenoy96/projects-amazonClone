var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var mongoosastic = require("mongoosastic");

//Schema
var ProductSchema = new Schema({
	category : {
		type : Schema.Types.ObjectId,
		ref : 'Category'
	},
	name : String,
	price : {
		type : Number,
		merged_type : 'double'
	},
	image : String
});
//plugin
ProductSchema.plugin(mongoosastic, {
	hosts : [
	'localhost:9200'
	]
})

module.exports = mongoose.model('Product', ProductSchema);