var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");
var config = require('../config');
// const bcrypt = require('bcrypt');
var companyUserMasterSchema = require('../model/companyusermaster');
var bookingMasterSchema = require('../model/booking');
var companyInventoryMasterSchema = require('../model/companyinventorymaster');
var companyServicesProviderSchema = require('../model/companyservicesprovider');

/* APIS listing. */

router.post('/companyUserSignup', async function (req, res, next) {
  const { companyId, userName, emailId, userPassword, userPin, userCategory } = req.body;
  try {
    var companyUser = new companyUserMasterSchema({
      _id: new config.mongoose.Types.ObjectId,
      companyId: companyId,
      userName: userName,
      emailId: emailId,
      userPassword: userPassword,
      userPin: userPin,
      userCategory: userCategory
    });
    await companyUser.save();
    res
      .status(200)
      .json({ Message: "Company User Registered!", Data: 1, IsSuccess: true });
  } catch (err) {
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

router.post("/companyUserSignIn", async function (req, res, next) {
  const { userName, userPassword,userPin } = req.body;
  try {
    let companyUser = await companyUserMasterSchema.find({
     
      userName: userName,
      isActive: true,
      $or:[
      {userPassword: userPassword},
      {userPin: userPin}
    ]});

    if (companyUser.length == 1) {
        res.status(200).json({
          Message: "Company User Login!",
          Data: companyUser,
          IsSuccess: true,
        });
      } else {
      res.status(200).json({
        Message: "invalid Data!",
        Data: companyUser,
        IsSuccess: true,
      });
    }
  } catch (err) {
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

router.post('/getInventoryAndServiceListByCompanyId', async function (req, res, next) {
  try {
    const {companyId} = req.body;
      let data = await companyInventoryMasterSchema.find({companyId:companyId});
      let  datalist=[];
      for (let i = 0; i < data.length; i++){
          var serviceProviders = [];
          if(data[i].multipleServiceProviderRequired == true){
              serviceProviders = await companyServicesProviderSchema.find({inventoryId:data[i].id});
          }
          datalist.push({Inventory:data[i],serviceProviders:serviceProviders});
      }
      res
          .status(200)
          .json({ Message: "Data Found!", Data: datalist, IsSuccess: true });

  } catch (err) {
      res.json({
          Message: err.message,
          Data: 0,
          IsdSuccess: false,
      });
  }
});

router.post('/getCompanyUserMaster', async function(req, res, next) {
  const { companyId } = req.body
  try {
      let data = await companyUserMasterSchema.find({ companyId: companyId });
      res
          .status(200)
          .json({ Message: "Company User Master Data!", Data: data, IsSuccess: true });

  } catch (err) {
      res.json({
          Message: err.message,
          Data: 0,
          IsdSuccess: false,
      });
  }
});

router.post('/updateCompanyUserPassword', async function (req, res, next) {
  const { emailId, userPassword } = req.body;
  try {
    let data = await companyUserMasterSchema.find({emailId:emailId});
    if(data.length == 1){
      var dataa = {userPassword: userPassword};
        let datas = await companyUserMasterSchema.findOneAndUpdate({emailId:emailId}, dataa);
      }
        res
          .status(200)
          .json({ Message: "PASSWORD CHANGED  DONE !", Data: data, IsSuccess: true });
  } catch (err) {
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

router.post('/deactivatedAccount', async function (req, res, next) {
  const { id  } = req.body;
  try {
    let data = await companyUserMasterSchema.find({_id:id});
    if(data.length == 1){
      var dataa = {isActive: "false"};
        let datas = await companyUserMasterSchema.findByIdAndUpdate({_id:id}, dataa);
      }
        res
          .status(200)
          .json({ Message: "Deactivated Account!", Data: 1, IsSuccess: true });
  } catch (err) {
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

router.post('/updateFCMTokenById', async function (req, res, next) {
  const { id,fcmToken } = req.body;
  try {
    let data = await companyUserMasterSchema.find({_id:id});
    if(data.length == 1){
      var dataa = {
        fcmToken : fcmToken
      };
        let datas = await companyUserMasterSchema.findByIdAndUpdate(id, dataa);
      }
        res
          .status(200)
          .json({ Message: "FCMToken Updated!", Data: 1, IsSuccess: true });
  } catch (err) {
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

router.post('/viewFeedbackByOrderNo', async function (req, res, next) {
  const { orderNo} = req.body;
  try {
    let data = await bookingMasterSchema.find({orderNo:orderNo});
    if(data.length == 1){
      res
          .status(200)
          .json({ Message: "View Feedback Detail !", Data: data, IsSuccess: true });
      }else{
        res
        .status(200)
        .json({ Message: "Error!", Data: 0, IsSuccess: true });
      }
        
  } catch (err) {
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

module.exports = router;
