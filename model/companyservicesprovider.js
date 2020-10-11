const mongoose = require('mongoose');

var companyServicesProviderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyId: {
        type: mongoose.Types.ObjectId,
        ref: 'companyMaster'
    },
    inventoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'companyInventoryMaster'
    },
    serviceProviderName: {
        type: String
    },
    serviceProviderDescription: {
        type: String
    },
    appointmentMinutes: {
        type: Number
    },
    rateType: {
        type: String
    },
    rateAmt: {
        type: Number
    },
    serviceProviderAvailable: {
        type: Boolean,
        default: true
    },
    lat: {
        type: Number
    },
    long: {
        type: Number
    }
});

module.exports = mongoose.model('companyServicesProvider', companyServicesProviderSchema);