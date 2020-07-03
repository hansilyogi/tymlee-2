const mongoose = require('mongoose');

var companyUserMasterSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    companyId:{
        type:mongoose.Types.ObjectId,
        ref:'companyMaster'
    },
    userName:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true
    },
    userPassword:{
        type:String,
        required:true
    },
    userPin:{
        type:String,
        required:true
    },
    userCategory:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('companyUserMaster',companyUserMasterSchema);