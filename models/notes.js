var mongoose = require('mongoose');
var passportLocalMongoose =require("passport-local-mongoose");
var objectiveSchema = require("../models/objective");
const notesSchema =new mongoose.Schema({
  username:{
      type:String,
      required:true,
      unique: true,
  },
  email:{
      type:String,
      required:true,
      unique: true,
  },
  notes:[objectiveSchema]
});
notesSchema.plugin(passportLocalMongoose);
var notes = mongoose.model('note',notesSchema);
module.exports =notes;