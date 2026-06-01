const mongoose =
  require("mongoose");

const visitorSchema =
  new mongoose.Schema({

    ip:String,

    country:String,

    city:String,

    device:String,

    pagesVisited:{
      type:Number,
      default:1,
    },

    online:{
      type:Boolean,
      default:true,
    },

    lastVisit:{
      type:Date,
      default:Date.now,
    },

    createdAt:{
      type:Date,
      default:Date.now,
    },

});

module.exports =
  mongoose.model(
    "Visitor",
    visitorSchema
  );