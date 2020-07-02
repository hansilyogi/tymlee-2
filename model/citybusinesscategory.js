const mongoose = require('mongoose');

var cityBusinessCategorySchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    businessCategoryId:{
        type:mongoose.Types.ObjectId,
        ref:'categoryMaster'
    },
    startDate:{
        type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model('cityBusinessCategory',cityBusinessCategorySchema);