var express    = require("express"),
	methodOverride = require("method-override"),
	expressSanitzer = require("express-sanitizer"),
	app        = express(),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser : true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitzer());
app.use(methodOverride("_method"));


var blogSchema = new mongoose.Schema({
	title : String,
	image :String,
	body :String,
	created :{type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title :"Test Blog",
// 	image :"https://images.unsplash.com/photo-1509559320938-387dfd4e966b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	body  :"This is a Blog post" 
// },
// 			{
// 	function(err,blog){
// 		if(err){
// 			console.log(err);
// 		}
// 		else{
// 			console.log("newly created Blog!");
// 			console.log(blog);
// 		}
// 	}
// })

app.get("/",function(req,res){
	res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogs : blogs});
		}
	});
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
		Blog.findById(req.params.id,function(err,foundBlog){
			if(err){
				res.redirect("/blogs");
			}
			else{
				res.render("show",{ blog: foundBlog});
			}
		});
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog : foundBlog});
		}
	});
	
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
})

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
})

app.listen(process.env.PORT || 5002, process.env.IP,function(){
	console.log("Server has started!!");
});