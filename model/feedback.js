const mongoose = require('mongoose');

var feedbackSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customerId:{
        type:mongoose.Types.ObjectId,
        ref:'customerMaster'
    },  
    message:{
        type:String,
        required:true
    },
    datetime:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('feedback',feedbackSchema);