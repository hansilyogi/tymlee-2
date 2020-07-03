const mongoose = require('mongoose');

var companyServicesProviderSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    companyId:{
        type:mongoose.Types.ObjectId,
        ref:'companyMaster'
    },
    inventoryId:{
        type:mongoose.Types.ObjectId,
        ref:'companyInventoryMaster'
    },
    serviceProviderName:{
        type:String,
        required:true
    },
    serviceProviderDescription:{
        type:String,
        required:true
    },
    appointmentMinutes:{
        type:Number,
        required:true
    },
    rateType:{
        type:String,
        required:true
    },
    rateAmt:{
        type:Number,
        required:true
    },
    serviceProviderAvailable:{
        type:Boolean
    }
});

module.exports = mongoose.model('companyServicesProvider',companyServicesProviderSchema);