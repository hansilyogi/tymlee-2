const mongoose = require('mongoose');

var companyInventoryMasterSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyId: {
        type: mongoose.Types.ObjectId,
        ref: 'companyMaster'
    },
    inventoryName: {
        type: String,
        unique: true,
        required: true
    },
    inventoryDescription: {
        type: String,
        required: true
    },
    appointmentMinutes: {
        type: Number
    },
    tableCounts: {
        type: Number,
        default: 0,
        required: false
    },
    multipleServiceProviderRequired: {
        type: Boolean,
        default: false
    },
    rateType: {
        type: String
    },
    rateAmt: {
        type: Number
    },
    inventoryNotes1Name: {
        type: String
    },
    inventoryNotes1: {
        type: String
    },
    inventoryNotes2Name: {
        type: String
    },
    inventoryNotes2: {
        type: String
    },
    inventoryNotes3Name: {
        type: String
    },
    inventoryNotes3: {
        type: String
    },
    inventoryAvailable: {
        type: Boolean
    }
});

module.exports = mongoose.model('companyInventoryMaster', companyInventoryMasterSchema);