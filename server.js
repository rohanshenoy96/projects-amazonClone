var express      = require("express");
var morgan       = require("morgan");
var mongoose     = require("mongoose");
var bodyParser   = require("body-parser");
var ejs 	     = require("ejs");
var engine	     = require("ejs-mate");
var session      = require("express-session");
var cookieParser = require("cookie-parser");
var flash        = require("express-flash");
var MongoStore   = require("connect-mongo")(session);
var passport     = require("passport");

var secret       = require("./config/secret");
var User   	     = require("./models/user.js");
var Category     = require("./models/category");

var cartLength   = require("./middleware/middleware");

var app = express();

//database connection
mongoose.connect(secret.database, function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("connected to database");
	}
})

//Middle ware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
	secret : secret.secretKey,
	resave : true,
	saveUninitialized : true,
	store : new MongoStore({
		url : secret.database,
		autoReconnect : true
	})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.user = req.user||null;
	next();
});

app.use(cartLength);

app.use(function(req, res, next){
	Category.find({}, function(err, categories){
		if(err) return next(err);
		res.locals.categories = categories;
		next();
	});
});

app.use(flash());
app.engine("ejs", engine);
app.set("view engine", "ejs");


var mainRoutes  = require("./routes/main.js");
var userRoutes  = require("./routes/user.js");
var adminRoutes = require("./routes/admin.js");
var apiRoutes   = require("./api/api");
app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api',apiRoutes);
// ,function(err){
// 	if(err){
// 		console.log("error is here")
// 	}
// }
// , function(err){
// 	if(err){
// 		console.log("error is here in 2" );
// 	}
// }
//Routes 

//Listen to port 
app.listen(secret.port, function(err){
	if(err) throw err;
	console.log("Server has started on port " + secret.port);
});