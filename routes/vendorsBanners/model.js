
const mongoose = require('mongoose');
var VendorBanners = new mongoose.Schema({
    companyId: {
        type: mongoose.Types.ObjectId,
        ref: 'companyMaster'
    },
    bannerSize: {
        type: String,
        required: true
    }, //full half one-third
    packageType: {
        type: String,
        required: true
    }, //general low medium high
    packageUnit: {
        type: String,
        required: false
    },
    UnitType: {
        type: String,
        required: false
    },//1-Week 2-Month
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    bannerImage: {
        type: String,
        required: true
    },
    bannerAttachment: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'ClientUpload'
    },
    url: {
        type: String,
        required: true
    },
    payModalId: {
        type: String,
        required: true
    },
    transactionNo: {
        type: String,
        required: true
    },
    orderNo: {
        type: String,
        required: true
    }, // bill
    billEmailed: {
        type:Boolean,
        required: false
    },
    emailDateTime: {
        type: Date,
        required: false,
    },

    offerCount: {
        type: Number,
        required: true
    },
    
    isApproved: {
     type: Boolean,
     default: false,
    },
    aprroveDate: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('vendorBanners', VendorBanners);