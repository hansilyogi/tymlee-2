const mongoose = require('mongoose');

var companyMasterSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyCode: {
        type: String
    },
    membershipId: {
        type: mongoose.Types.ObjectId,
        ref: 'membershipTypeMst'
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
    bookingType: {
        type: String,
        default: 'Appointment'
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
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
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
    personPhotoAttachment: {
        type: mongoose.Types.ObjectId,
        ref: 'ClientUpload'
    },
    aadharCard: {
        type: String
    },
    aadharCardAttachment: {
        type: mongoose.Types.ObjectId,
        ref: 'ClientUpload'
    },
    panCard: {
        type: String
    },
    panCardAttachment: {
        type: mongoose.Types.ObjectId,
        ref: 'ClientUpload'
    },
    cancelledCheque: {
        type: String
    },
    cancelledChequeAttachment: {
        type: mongoose.Types.ObjectId,
        ref: 'ClientUpload'
    },
    weekStartDay: {
        type: String
    },
    companyLogo: {
        type: String
    },
    companyLogoAttachment: {
        type: mongoose.Types.ObjectId,
        ref: 'ClientUpload'
    },
    cancellationPolicy: {
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
    notes: String

});
// companyMasterSchema.statics = {
//     createNewFile: async function(){
//         let Modal = this;
//         let obj = {
//             // createdBy: req.user,
//             // createdByEmail: req.email,
//             name: data.originalName,
//             mimeType: data.mimeType,
//             path: data.path
//             // size: fileSize
//         }
//         new Modal(obj).save();
//     }
// }
module.exports = mongoose.model('companyMaster', companyMasterSchema);