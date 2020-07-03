var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");
var config = require('../config');
var customerMasterSchema = require('../model/customermaster');


/* GET home page. */
router.post('/customerSignUp', async function(req, res, next) {
    const { firstName, lastName, mobileNo, emailID, password, address1, address2, city, state, zipcode,} = req.body;
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
          address1:address1,
          address2:address2,
          city:city,
          state:state,
          zipcode:zipcode
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
  const { emailID,password } = req.body;
  try {
    let Customer = await customerMasterSchema.find({
      emailID: emailID,
      password:password,
      isVerified: true,
      isActive: true,
    });
    if (Customer.length == 1) {
      res.status(200).json({
        Message: "Customer  Login!",
        Data: Customer,
        IsSuccess: true,
      });
    } else {
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

module.exports = router;
