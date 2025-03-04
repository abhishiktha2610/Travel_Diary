const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelDiarySchema = new Schema({
    title: {type:String, required: true},
    story: {type:String, required: true},
    visitedLocation: {type: [String], default: []},
    isFavourite: {type:Boolean, default:false},
    userId: {type:Schema.Types.ObjectId, ref: "User", required:true},
    imageUrl: {type:String, required: true},
    visitedDate: {type:Date, required:true},
});

module.exports = mongoose.model("TravelDiary", travelDiarySchema);