
const mongoose = require('mongoose');
var OffersMasterSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Types.ObjectId,
        ref: 'companyMaster'
    },
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    offerCount: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        required: true
    },
    attachment: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'ClientUpload'
    },
    isApproved: {
     type: Boolean,
     default: false,
    },
    offerTerms: {
        type: String,
        required: true
    },

    aprroveDate: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('offersMaster', OffersMasterSchema);