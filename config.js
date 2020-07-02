require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODBURL,{
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.connection.once('open',() => {console.log('connected');})
.on('error',() => {console.log('not connected');})

module.exports ={mongoose};