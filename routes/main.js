var router  = require("express").Router();
var Product = require("../models/product");

Product.createMapping(function(err, mapping){
	if(err){
		console.log("Error creating mapping");
		console.log(err);
	}else{
		console.log("Mapping Cretaed");
		console.log(mapping);
	}
});

var stream = Product.synchronize();
var count = 0;

stream.on('data', function(){
	count++;	
});
stream.on('close', function(){
	console.log("Indexed " + count + "documents");
});
stream.on('error', function(err){
	console.log(err);
});

// Home route
router.get("/", function(req, res){
	res.render("main/home");
});

//about route
router.get("/about", function(req, res){
	res.render("main/about");
});

//category route
router.get("/products/:id", function(req, res, next){
	Product
		.find({category : req.params.id})
		.populate('category')
		.exec(function(err, products){
			if(err) return next(err);
			res.render('main/category', {
				products : products
			});
		});
});

//product route
router.get("/product/:id", function(req, res, next){
	Product.findOne({_id : req.params.id}, function(err, product){
		if(err) return next(err);
		res.render("main/product.ejs",{
			product : product
		})
	});
});


module.exports = router;
