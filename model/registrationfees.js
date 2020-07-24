const mongoose = require('mongoose');

var registrationFeesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyId: {
        type: mongoose.Types.ObjectId,
        ref: 'companyMaster'
    },
    regNo: {
        type: Number,
        required: true
    },
    regDate: {
        type: Date,
        required: true
    },
    membershipTypeID: {
        type: mongoose.Types.ObjectId,
        ref: 'membershipTypeMst'
    },
    amtPaid: {
        type: Number,
        required: true
    },
    taxableValue: {
        type: Number
    },
    cGSTAmt: {
        type: Number
    },
    sGSTAmt: {
        type: Number
    },
    iGSTAmt: {
        type: Number
    },
    payThrough: {
        type: String
    },
    payDateTime: {
        type: Date
    },
    transactionNo: {
        type: String
    },
    billNo: {
        type: String,
        required: true
    },
    billEmailed: {
        type: Boolean
    },
    EmailDateTime: {
        type: Date
    }
});

module.exports = mongoose.model('registrationFees', registrationFeesSchema);