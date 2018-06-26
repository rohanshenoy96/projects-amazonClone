var mongoose = require("mongoose");
var bcrypt   = require("bcrypt-nodejs");
var Schema   = mongoose.Schema;
var crypto   = require("crypto");

//user Schema 
var UserSchema = new Schema({
	email : {type : String, es_type: 'text', unique : true, lowercase: true},
	password : String,
	profile : {
		name : {type : String, es_type: 'text', default : ''},
		picture : {type : String, es_type: 'text', default: ''},
		address : {type : String, es_type: 'text'},
		history : [{
			date : Date,
			paid : {type : Number, default : 0}
		}]
	}
});

// Hash the password before we eve save it to the database
UserSchema.pre("save", function(next){
	var user = this;
	const saltRounds = 10;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(saltRounds, function(err, salt){
		if(err) return next(err);
		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

//Compare password in the database with the one in that user typed in...

UserSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password,this.password);
}
UserSchema.methods.gravatar = function(size){
	if(!this.size) size=200;

	if(!this.email) return 'https://en.gravatar.com/avatar/?s='+size+'&d=retro';

	var md5 = crypto.createHash('md5').update(this.email).digest('hex');

	return 'https://en.gravatar.com/avatar/'+ md5 + '?s=' + size + '&d=retro';
}

module.exports = mongoose.model('User', UserSchema);



