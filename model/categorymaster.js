const mongoose = require('mongoose');
const { text } = require('express');

var categoryMasterSchema = new mongoose.Schema({
 _id: mongoose.Schema.Types.ObjectId,
 businessCategoryName:{
     type:String,
     required:true
 },
 startDate:{
     type:Date,
     required:true
 },
 bookingAmt:{
     type:Number,
     required:true
 },
 clientAmt:{
     type:Number,
     required:true
 },
 refundAmt:{
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
 businessIcon:{
     type:String,
     required:true
 },
 isActive:{
     type:Boolean,
     default:true
 }
});

module.exports = mongoose.model('categoryMaster',categoryMasterSchema);