require('dotenv').config();
const mongoose = require('mongoose');
console.log(process.env.MONGODBURL);
mongoose.connect('mongodb+srv://timely:timely2015@cluster0.51it2.mongodb.net/timely',{
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.connection.once('open',() => {console.log('connected');})
.on('error',() => {console.log('not connected');})

module.exports ={mongoose};