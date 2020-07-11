var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");
var config = require('../config');
// const bcrypt = require('bcrypt');
var customerMasterSchema = require('../model/customermaster');
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

/* GET home page. */
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


router.post("/sendotp", async function (req, res, next) {
  const { emailID } = req.body;
  try {
    let message = "Your verification code is " + 2345 + " ";
    let msgportal =
      "http://promosms.itfuturz.com/vendorsms/pushsms.aspx?user=" +
      process.env.SMS_USER +
      "&password=" +
      process.env.SMS_PASS +
      "&msisdn=" +
      emailID +
      "&sid=" +
      process.env.SMS_SID +
      "&msg=" +
      message +
      "&fl=0&gwid=2";
    let getresponse = await axios.get(msgportal);
    if (getresponse.data.ErrorMessage == "Success") {
      res
        .status(200)
        .json({ Message: "Message Sent!", Data: 1, IsSuccess: true });
    } else {
      res
        .status(200)
        .json({ Message: "Message Not Sent!", Data: 0, IsSuccess: true });
    }
  } catch (err) {
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

router.post("/verify", async function (req, res, next) {
  const { mobileNo, fcmToken } = req.body;
  try {
    let updateCustomer = await customerSchema.findOneAndUpdate(
      { mobileNo: mobileNo },
      { isVerified: true, fcmToken: fcmToken }
    );
    if (updateCustomer != null) {
      res
        .status(200)
        .json({ Message: "Verification Complete!", Data: 1, IsSuccess: true });
    } else {
      res
        .status(200)
        .json({ Message: "Verification Failed!", Data: 0, IsSuccess: true });
    }
  } catch (err) {
    res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
  }
});

module.exports = router;
