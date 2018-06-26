var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

//Schema
var CategorySchema = new Schema({
	name : {
		type : String,
		unique : true,
		es_type : 'text',
		lowercase : true
	}
});

module.exports = mongoose.model('Category', CategorySchema);