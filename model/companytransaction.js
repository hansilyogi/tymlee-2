const mongoose = require('mongoose');

var companyTransactionSchema = new mongoose.Schema({
 _id: mongoose.Schema.Types.ObjectId,
 companyId:{
    type:mongoose.Types.ObjectId,
    ref:'companyMaster'
},
inventoryId:{
    type:mongoose.Types.ObjectId,
    ref:'companyInventoryMaster'
},
 transactionType:{
     type:Number,
     required:true
 },
 transactionDate:{
     type:Date,
     default:Date.now
 },
 transactionMode:{
     type:String,
     required:true
 },
 drAmt:{
     type:Number
 },
 crAmt:{
     type:Number
 },
 remark:{
     type:String,
     required:true
 },
 entryTime:{
     type:String,
     required:true
 },
 entryBy:{
     type:Number,
     required:true
 }
});

module.exports = mongoose.model('companyTransaction',companyTransactionSchema);