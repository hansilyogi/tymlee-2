var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");
var config = require('../config');
// const bcrypt = require('bcrypt');
var companyUserMasterSchema = require('../model/companyusermaster');


/* GET home page. */

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
  const { userName, userPassword } = req.body;
  try {
    let companyUser = await companyUserMasterSchema.find({
      userName: userName,
      userPassword: userPassword,
      isActive: true,
    });
    if (companyUser.length == 1) {
      res.status(200).json({
        Message: "Company User Login!",
        Data: companyUser,
        IsSuccess: true,
      });
    }
    else {
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

module.exports = router;
