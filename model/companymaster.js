const mongoose = require('mongoose');

var companyMasterSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyCode: {
        type: String
    },
    doj: {
        type: Date
    },
    businessCategoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'categoryMaster'
    },
    companyName: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String
    },
    cityMasterId: {
        type: mongoose.Types.ObjectId,
        ref: 'cityMaster'
    },
    zipcode: {
        type: String
    },
    mapLocation: {
        type: String
    },
    phone: {
        type: String
    },
    fax: {
        type: String
    },
    url: {
        type: String
    },
    supportEmail: {
        type: String
    },
    adminEmail: {
        type: String
    },
    adminMobile: {
        type: String
    },
    adminPassword: {
        type: String
    },
    gstinNo: {
        type: String
    },
    paNo: {
        type: String
    },
    bank: {
        bankName: {
            type: String
        },
        bankBranchName: {
            type: String
        },
        bankAddress: {
            type: String
        },
        bankCity: {
            type: String
        },
        bankState: {
            type: String
        },
        bankAccountNo: {
            type: String
        },
        bankIfscCode: {
            type: String
        }
    },
    companyType: {
        type: String
    },
    personName: {
        type: String
    },
    personPhoto: {
        type: String
    },
    aadharCard: {
        type: String
    },
    panCard: {
        type: String
    },
    cancelledCheque: {
        type: String
    },
    weekStartDay: {
        type: String
    },
    companyLogo: {
        type: String
    },
    cancellationPolicy: {
        type: String
    },
    companyHtmlPage: {
        type: String
    },
    registrationValidUpto: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true
    },
    otp: String,
    otpSentOn:{
        type:Date,
        default:null
    },
});

module.exports = mongoose.model('companyMaster', companyMasterSchema);