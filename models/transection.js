var mongoose= require("mongoose");

var transectionSchema = new mongoose.Schema({
    text: String,
    amount: Number
});

module.exports = mongoose.model("Transection", transectionSchema);