var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser= require("body-parser");

// app config
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

// db config
mongoose.connect("mongodb://localhost:27017/expense_tracker", {useNewUrlParser: true, useUnifiedTopology: true});
var transectionSchema = new mongoose.Schema({
    text: String,
    amount: Number
});

var Transection = mongoose.model("Transection", transectionSchema);


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
            res.render("index", {transections: allTrans});
        }
    });
});

// NEW -form to show new transection
app.get("/transections/new", function(req, res){
    res.render("new");
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
            res.render("index", {transections: trans});
        }
    });
});

app.listen(4000, function(){
    console.log("server started...");
})