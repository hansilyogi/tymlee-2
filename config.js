require('dotenv').config();
const mongoose = require('mongoose');
const firebase = require('firebase-admin');


mongoose.connect('mongodb+srv://timely:timely2015@cluster0.51it2.mongodb.net/timely',{
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const serviceAccount = require("./Service.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB,
});

mongoose.connection.once('open',() => {console.log('connected');})
.on('error',() => {console.log('not connected');})

module.exports ={mongoose, firebase};