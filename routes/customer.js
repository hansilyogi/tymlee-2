var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");
var config = require('../config');
// const bcrypt = require('bcrypt');
var customerMasterSchema = require('../model/customermaster');
var companyInventoryMasterSchema = require('../model/companyinventorymaster');
var companyServicesProviderSchema = require('../model/companyservicesprovider');
var cityMasterSchema = require('../model/citymaster');
var categoryMasterSchema = require('../model/categorymaster');
var companyMasterSchema = require('../model/companymaster');
var termnconditionSchema = require('../model/termncondition');
var bannerSchema = require('../model/banner');
var bookingSlotMasterSchema =  require('../model/bookingslotmaster');

var customerlocation = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "uploads/customer");
  },
  filename: function (req, file, cb) {
      cb(
          null,
          file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
  },
});
var uploadcustomer = multer({ storage: customerlocation });

/* APIS listing. */
router.post('/customerSignUp', async function (req, res, next) {
  const { firstName, lastName, mobileNo, emailID, password, address1, address2, city, state, zipcode } = req.body;
  try {
    let existCustomer = await customerMasterSchema.find({ mobileNo: mobileNo });
    if (existCustomer.length == 1) {
      res.status(200).json({
        Message: "Customer Already Registered!",
        Data: 0,
        IsSuccess: true,
      });
    } else {
      let newCustomer = new customerMasterSchema({
        _id: new config.mongoose.Types.ObjectId(),
        firstName: firstName,
        lastName: lastName,
        mobileNo: mobileNo,
        emailID: emailID,
        password: password,
        address1: address1,
        address2: address2,
        city: city,
        state: state,
        zipcode: zipcode
      });
      newCustomer.save();
      res
        .status(200)
        .json({ Message: "Customer Registered!", Data: 1, IsSuccess: true });
    }
  } catch (err) {
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

router.post("/customerSignIn", async function (req, res, next) {
  const { emailID, password } = req.body;
  try {

    let Customer = await customerMasterSchema.find({
      emailID: emailID,
      password: password,
      isVerified: true,
      isActive: true,
    });
    if (Customer.length == 1) {
      res.status(200).json({
        Message: "Customer  Login!",
        Data: Customer,
        IsSuccess: true,
      });
    }
    else {
      res.status(200).json({
        Message: "invalid Data!",
        Data: Customer,
        IsSuccess: true,
      });
    }
  } catch (err) {
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

router.post('/getBanner', async function (req, res, next) {
  try {
      let data = await bannerSchema.find();
      res
          .status(200)
          .json({ Message: "Banner Data!", Data: data, IsSuccess: true });

  } catch (err) {
      res.json({
          Message: err.message,
          Data: 0,
          IsdSuccess: false,
      });
  }
});

router.post('/getCityMaster', async function (req, res, next) {
  try {
      let data = await cityMasterSchema.find();
      res
          .status(200)
          .json({ Message: "City Master Data!", Data: data, IsSuccess: true });

  } catch (err) {
      res.json({
          Message: err.message,
          Data: 0,
          IsdSuccess: false,
      });
  }
});

router.post('/updateCustomer',uploadcustomer.single("image"), async function (req, res, next) {
  const { id, firstName, lastName, mobileNo, emailID, password, address1, address2, city, state, zipcode } = req.body;
  try {
    const file = req.file;
    if(file == undefined){
      var data = ({
        firstName: firstName,
        lastName: lastName,
        mobileNo: mobileNo,
        emailID: emailID,
        password: password,
        address1: address1,
        address2: address2,
        city: city,
        state: state,
        zipcode: zipcode
      });
    }else{
      var data = ({
        firstName: firstName,
        lastName: lastName,
        mobileNo: mobileNo,
        emailID: emailID,
        password: password,
        address1: address1,
        address2: address2,
        city: city,
        state: state,
        zipcode: zipcode,
        image:file.path
      });
    }
        let datas = await customerMasterSchema.findByIdAndUpdate(id, data);
        res
          .status(200)
          .json({ Message: "Customer Detail Updated!", Data: 1, IsSuccess: true });
  } catch (err) {
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

router.post('/getTermNCondition', async function (req, res, next) {
  try {
      let data = await termnconditionSchema.find();
      res
          .status(200)
          .json({ Message: "Term N Condition Data!", Data: data, IsSuccess: true });

  } catch (err) {
      res.json({
          Message: err.message,
          Data: 0,
          IsdSuccess: false,
      });
  }
});

router.post('/getCategoryMaster', async function (req, res, next) {
  try {
      let data = await categoryMasterSchema.find();
      res
          .status(200)
          .json({ Message: "Catergory Master Data!", Data: data, IsSuccess: true });

  } catch (err) {
      res.json({
          Message: err.message,
          Data: 0,
          IsdSuccess: false,
      });
  }
});

router.post('/getCompanyMasterByBusinessCategoryId', async function (req, res, next) {
  try {
    const { businessCategoryId } = req.body;
      let data = await companyMasterSchema.find({businessCategoryId:businessCategoryId}).populate('businessCategoryId', ' businessCategoryName').populate('cityMasterId');
      res
          .status(200)
          .json({ Message: "Company Master Data!", Data: data, IsSuccess: true });

  } catch (err) {
      res.json({
          Message: err.message,
          Data: 0,
          IsdSuccess: false,
      });
  }
});

router.post('/updateCustomerPassword', async function (req, res, next) {
  const { emailID, password } = req.body;
  try {
    let data = await customerMasterSchema.find({emailID:emailID});
    if(data.length == 1){
      var dataa = {
        password: password
      };
        let datas = await customerMasterSchema.findOneAndUpdate({emailID:emailID}, dataa);
      }
        res
          .status(200)
          .json({ Message: "PASSWORD CHANGED S Updated!", Data: data, IsSuccess: true });
  } catch (err) {
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

router.post('/getSlot', async function(req, res, next) {
  const { inventoryId, serviceProviderId} = req.body
  try {
      let data = await bookingSlotMasterSchema.find({ 
          inventoryId:inventoryId,
          $or:[{serviceProviderId:serviceProviderId}]
       });
      res
          .status(200)
          .json({ Message: "Slot Data!", Data: data, IsSuccess: true });

  } catch (err) {
      res.json({
          Message: err.message,
          Data: 0,
          IsdSuccess: false,
      });
  }
});

module.exports = router;
