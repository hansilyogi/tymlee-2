var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");
// const bcrypt = require('bcrypt');

var companyMasterSchema = require("../model/companymaster");
var cityMasterSchema = require("../model/citymaster");
var categoryMasterSchema = require("../model/categorymaster");

var a = Math.floor(100000 + Math.random() * 900000);

config = require("../config");

//image uploading

var filestorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/Document");
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});
var finalstorage = multer({ storage: filestorage });
var fieldset = finalstorage.fields([
    { name: "personPhoto", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "cancelledCheque", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
]);

/* APIS listing. */
router.post("/VendorSignUp", fieldset, async function(req, res, next) {
    const {
        doj,
        businessCategoryId,
        companyName,
        addressLine1,
        addressLine2,
        cityMasterId,
        zipcode,
        mapLocation,
        phone,
        fax,
        url,
        supportEmail,
        adminEmail,
        adminMobile,
        adminPassword,
        gstinNo,
        paNo,
        bankName,
        bankBranchName,
        bankAddress,
        bankCity,
        bankState,
        bankAccountNo,
        bankIfscCode,
        companyType,
        personName,
        weekStartDay,
        cancellationPolicy,
        companyHtmlPage,
        registrationValidUpto,
    } = req.body;
    try {
        let existCompany = await companyMasterSchema.find({
            companyName: companyName,
        });
        if (existCompany.length == 1) {
            res.status(200).json({
                Message: "Company Name Already Registered!",
                Data: 0,
                IsSuccess: true,
            });
        } else {
            var companymaster = new companyMasterSchema({
                _id: new config.mongoose.Types.ObjectId(),
                companyCode: "comp" + a,
                doj: doj,
                businessCategoryId: businessCategoryId,
                companyName: companyName,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                cityMasterId: cityMasterId,
                zipcode: zipcode,
                mapLocation: mapLocation,
                phone: phone,
                fax: fax,
                url: url,
                supportEmail: supportEmail,
                adminEmail: adminEmail,
                adminMobile: adminMobile,
                adminPassword: adminPassword,
                gstinNo: gstinNo,
                paNo: paNo,
                bank: {
                    bankName: bankName,
                    bankBranchName: bankBranchName,
                    bankAddress: bankAddress,
                    bankCity: bankCity,
                    bankState: bankState,
                    bankAccountNo: bankAccountNo,
                    bankIfscCode: bankIfscCode,
                },
                companyType: companyType,
                personName: personName,
                personPhoto: req.files !== undefined && req.files.personPhoto == undefined ?
                    null : req.files.personPhoto[0].path,
                aadharCard: req.files !== undefined && req.files.aadharCard == undefined ?
                    null : req.files.aadharCard[0].path,
                panCard: req.files !== undefined && req.files.panCard == undefined ? null : req.files.panCard[0].path,
                cancelledCheque: req.files.cancelledCheque == undefined ?
                    null : req.files.cancelledCheque[0].path,
                weekStartDay: weekStartDay,
                companyLogo: req.files !== undefined && req.files.companyLogo == undefined ?
                    null : req.files.companyLogo[0].path,
                cancellationPolicy: cancellationPolicy,
                companyHtmlPage: companyHtmlPage,
                registrationValidUpto: registrationValidUpto,
            });
            var datas = await companymaster.save();
            console.log(datas);
            if (datas) {
                res
                    .status(200)
                    .json({ Message: "Company Master Added!", Data: 1, IsSuccess: true });
            } else {
                res.status(200).json({
                    Message: "Company Master Not Added!",
                    Data: 0,
                    IsSuccess: true,
                });
            }
        }
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/VendorSignIn", async function(req, res, next) {
    const { adminEmail, adminPassword } = req.body;

    console.log('--->>>--------req.body', req.body);
    try {
        let company = await companyMasterSchema.find({
            adminEmail: adminEmail,
            adminPassword: adminPassword,
            active: true,
        });
        if (company.length == 1) {
            res.status(200).json({
                Message: "company  Login!",
                Data: company,
                IsSuccess: true,
            });
        } else {
            res.status(200).json({
                Message: "invalid Data!",
                Data: 0,
                IsSuccess: true,
            });
        }
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/getCity", async function(req, res, next) {
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

router.post("/getCategory", async function(req, res, next) {
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


module.exports = router;