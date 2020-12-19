var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// ROUTES
router.get("/", function(req, res){
    res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========

// show register form
router.get("/register", function(req, res){
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/dashboard");
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local", {
   successRedirect: "/dashboard",
   failureRedirect:"/login" 
}), function(req, res){
});

// logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "successfully logged out!")
    res.redirect("/");
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "please login first!");
    res.redirect("/login");
}

module.exports = router;