const mongoose = require('mongoose');

var cityMasterSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    cityCode:{
        type:String,
        required:true
    },
    cityName:{
        type:String,
        required:true
    },
    stateName:{
        type:String,
        required:true
    },
    stateCode:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model('cityMaster',cityMasterSchema);