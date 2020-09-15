
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
const mongoose = require('mongoose');
var bookingMasterSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customerId: {
        type: mongoose.Types.ObjectId,
        ref: 'customerMaster'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    orderNo: {
        type: String,
        required: true
    },
    companyId: {
        type: mongoose.Types.ObjectId,
        ref: 'companyMaster'
    },
    inventoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'companyInventoryMaster'
    },
    serviceProviderId: {
        type: mongoose.Types.ObjectId,
        ref: 'companyServicesProvider'
    },
    bookingSlotId: {
        type: mongoose.Types.ObjectId,
        ref: 'bookingSlotMaster'
    },
    appointmentDate: {
        type: String,
        set: date => formatDate(date)
    },
    appointmentTime: {
        type: String
    },
    bookingForName: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    specialRequest: {
        type: String
    },
    sendMeReminderMail: {
        type: Boolean
    },
    amount: {
        type: Number
    },
    serviceCharge: {
        type: Number
    },
    totalAmt: {
        type: Number
    },
    taxableValue: {
        type: Number
    },
    cgstAmt: {
        type: Number
    },
    sgstAmt: {
        type: Number
    },
    igstAmt: {
        type: Number
    },
    payThrough: {
        type: String
    },
    payDateTime: {
        type: String
    },
    transactionNo: {
        type: String
    },
    billNo: {
        type: String
    },
    billEmailed: {
        type: Boolean
    },
    emailDateTime: {
        type: Date
    },
    geoLocationArrival: {
        type: Date
    },
    noShowTime: {
        type: Date
    },
    customerReached: {
        type: Date
    },
    serviceStartedTime: {
        type: Date
    },
    serviceCompletedTime: {
        type: Date
    },
    amtCollectedFromCustomer: {
        type: Number
    },
    customerFeeback: {
        type: String
    },
    customerRating: {
        type: Number
    },
    status: {
        type: String,
        default: "pending"
    }
});

module.exports = mongoose.model('bookingMaster', bookingMasterSchema);