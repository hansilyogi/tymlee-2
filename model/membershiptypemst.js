const mongoose = require('mongoose');

var membershipTypeMstSchema = new mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   membershipType:{
       type:String,
       required:true
   },
   registrationFee:{
       type:Number,
       required:true
   },
   csgtPercent:{
       type:Number,
       required:true
   },
   sgstPercent:{
       type:Number,
       required:true
   },
   igstPercent:{
       type:Number,
       required:true
   },
   registrationIcon:{
       type:String,
       required:true
   },
   attachment: {
    type: mongoose.Types.ObjectId,
    ref: 'ClientUpload'
},
   benefitList:{
       type:String,
       required:true
   },
   isActive:{
       type:Boolean,
       default:true
   }

});


module.exports = mongoose.model('membershipTypeMst', membershipTypeMstSchema);