var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    bodyParser= require("body-parser");

// app config
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

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
            res.render("index", {transection: allTrans});
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
            res.render("edit", {transection: foundTrans});
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


app.listen(4000, function(){
    console.log("server started...");
})