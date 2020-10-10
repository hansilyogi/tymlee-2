const mongoose = require('mongoose');

var stateMasterSchema = new mongoose.Schema({
    stateName: {
        type: String,
        required: true
    },
    stateCode: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    userPushEach: true
});

module.exports = mongoose.model('stateMaster', stateMasterSchema);