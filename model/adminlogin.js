const mongoose = require('mongoose');

var adminLoginSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model('adminLogin', adminLoginSchema);