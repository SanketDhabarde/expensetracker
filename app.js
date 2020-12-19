var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    Transection = require("./models/transection"),
    User = require("./models/user"),
    flash = require("connect-flash"),
    bodyParser= require("body-parser");

var transectionRoutes = require("./routes/transection");
var indexRoutes = require("./routes/index");

// app config
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(transectionRoutes);
app.use(indexRoutes);


app.listen(4000, function(){
    console.log("server started at port 4000...");
});