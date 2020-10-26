
const mongoose = require('mongoose');
var BannerMaster = new mongoose.Schema({
    // companyId: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'companyMaster'
    // },
    bannerSize: {
        type: String,
        required: true
    }, //full half one-third
    packageType: {
        type: String,
        required: true
    }, //general low medium high
    weekPrice: {
        type: Number,
        required: true
    },
    monthPrice: {
        type: Number,
        required: true
    }
    // UnitType: {
    //     type: String,
    //     required: false
    // },//1-Week 2-Month

}, {
    timestamps: true
});

module.exports = mongoose.model('bannerMaster', BannerMaster);