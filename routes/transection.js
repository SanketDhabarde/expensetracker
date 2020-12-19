var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Transection = require("../models/transection");

// INDEX - To list the transections
router.get("/transections/:id", function(req, res){
    User.findById(req.params.id).populate("transections").exec(function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            res.render("transections/index",{user:foundUser});
        }
    })
});

// NEW -form to show new transection
router.get("/transections/:id/new", function(req, res){
    User.findById(req.params.id, function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            res.render("transections/new", {user: foundUser});
        }
    });
});

// CREATE- to create the transection
router.post("/transections/:id", function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
        }else{
            // create the transection
            var text = req.body.text;
            var amount = req.body.amount;

            var newTransection= {text: text, amount: amount};
            Transection.create(newTransection, function(err, trans){
                if(err){
                    console.log(err);
                }else{
                    // push the transection into user 
                    user.transections.push(trans);
                    // save the user
                    user.save();
                    req.flash("success", "transenction added successfully!")
                    res.redirect("/transections/"+ user._id);
                }
            });
        }
    })
});

// EDIT - to edit the transection
router.get("/transections/:id/:trans_id/edit", function(req, res){
    Transection.findById(req.params.trans_id, function(err, foundTrans){
        if(err){
            console.log(err);
        }else{
            res.render("transections/edit", {transection: foundTrans});
        }
    });
});

// UPDATE - to update the transection
router.put("/transections/:id/:trans_id", function(req, res){
    var text = req.body.text;
    var amount = req.body.amount;

    var updatedTransection= {text: text, amount: amount};
    Transection.findByIdAndUpdate(req.params.trans_id, updatedTransection, function(err, updatedTrans){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "transection edited successfully!");
            res.redirect("/transections/"+ req.params.id);
        }
    });
});

// DELETE - TO delete the transection
router.delete("/transections/:id/:trans_id", function(req, res){
    Transection.findByIdAndRemove(req.params.trans_id, function(err){
        if(err){
            res.redirect("/transections/"+ req.params.id);
        }else{
            req.flash("success", "transection deleted successfully!");
            res.redirect("/transections/"+ req.params.id);
        }
    });
});

// user dashboard
router.get("/dashboard",isLoggedIn, function(req, res){
    res.render("dashboard");
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