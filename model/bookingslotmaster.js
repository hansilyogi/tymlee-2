const mongoose = require('mongoose');
const { Timestamp } = require('mongodb');

var bookingSlotMasterSchema = new mongoose.Schema({
 _id: mongoose.Schema.Types.ObjectId,
 companyId:{
    type:mongoose.Types.ObjectId,
    ref:'companyMaster'
},
inventoryId:{
    type:mongoose.Types.ObjectId,
    ref:'companyInventoryMaster'
},
serviceProviderId:{
    type:mongoose.Types.ObjectId,
    ref:'companyServicesProvider'
 },
 dayName:{
     type:String,
     required:true
 },
 slotName:{
     type:String,
     required:true
 },
 fromTime:{
     type:String,
     required:true
 },
 toTime:{
     type:String,
     required:true
 },
 appointmentCount:{
     type:Number,
     required:true
 },
 rate:{
     type:Number,
     required:true
 },
 slotAvailable:{
     type:Boolean,
     default:true
 }
});

module.exports = mongoose.model('bookingSlotMaster',bookingSlotMasterSchema);