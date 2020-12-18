var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    Transection = require("./models/transection"),
    User = require("./models/user"),
    bodyParser= require("body-parser");

// app config
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// db config
mongoose.connect("mongodb://localhost:27017/expense_tracker", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});


// passport config
app.use(require("express-session")({
    secret: "hello world!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// ROUTES
app.get("/", function(req, res){
    res.render("landing");
});
// INDEX - To list the transections
app.get("/transections", function(req, res){
    Transection.find({}, function(err, allTrans){
        if(err){
            console.log(err);
        }else{
            res.render("transections/index", {transection: allTrans});
        }
    });
});

// NEW -form to show new transection
app.get("/transections/new", function(req, res){
    res.render("transections/new");
});

// CREATE- to create the transection
app.post("/transections", function(req, res){
    var text = req.body.text;
    var amount = req.body.amount;

    var newTransection= {text: text, amount: amount};
    Transection.create(newTransection, function(err, trans){
        if(err){
            console.log(err);
        }else{
            res.redirect("/transections");
        }
    });
});

// EDIT - to edit the transection
app.get("/transections/:id/edit", function(req, res){
    Transection.findById(req.params.id, function(err, foundTrans){
        if(err){
            console.log(err);
        }else{
            res.render("transections/edit", {transection: foundTrans});
        }
    });
});

// UPDATE - to update the transection
app.put("/transections/:id", function(req, res){
    var text = req.body.text;
    var amount = req.body.amount;

    var updatedTransection= {text: text, amount: amount};
    Transection.findByIdAndUpdate(req.params.id, updatedTransection, function(err, updatedTrans){
        if(err){
            console.log(err);
        }else{
            res.redirect("/transections");
        }
    });
});

// DELETE - TO delete the transection
app.delete("/transections/:id", function(req, res){
    Transection.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/transections");
        }else{
            res.redirect("/transections");
        }
    });
});

// ===========
// AUTH ROUTES
// ===========

// show register form
app.get("/register", function(req, res){
    res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/transections");
        });
    });
});

// show login form
app.get("/login", function(req, res){
    res.render("login");
});

// handle login logic
app.post("/login", passport.authenticate("local", {
   successRedirect: "/transections",
   failureRedirect:"/login" 
}), function(req, res){
});

// logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/transections");
});

app.listen(4000, function(){
    console.log("server started...");
});