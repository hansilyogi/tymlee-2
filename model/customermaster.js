const mongoose = require('mongoose');

var customerMasterSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    mobileNo:{
        type:String,
        required:true
    },
    emailID:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    address1:{
        type:String,
        required:true
    },
    address2:{
        type:String
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    zipcode:{
        type:String,
        required:true
    },
    oTP:{
        type:String,
        default:null
    },
    oTPSentOn:{
        type:Date,
        default:null
    },
    oTPVerifiedOn:{
        type:String,
        default:null
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    image:{
        type: mongoose.Types.ObjectId,
        ref: 'ClientUpload'
    },
    fcmToken:{
        type:String
    }

});

module.exports = mongoose.model('customerMaster',customerMasterSchema);