const mongoose = require('mongoose');

var cityMasterSchema = new mongoose.Schema({
    cityCode: {
        type: String,
        required: true
    },
    cityName: {
        type: String,
        required: true
    },
    stateId: {
        type: mongoose.Types.ObjectId,
        ref: 'companyMaster',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('cityMaster', cityMasterSchema);