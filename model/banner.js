const mongoose = require('mongoose');

var bannerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    datetime:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('banner',bannerSchema);