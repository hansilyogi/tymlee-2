var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");
// const bcrypt = require('bcrypt');
var membershipTypeMstSchema = require("../model/membershiptypemst");
var cityMasterSchema = require("../model/citymaster");
var categoryMasterSchema = require("../model/categorymaster");
var cityBusinessCategorySchema = require("../model/citybusinesscategory");
var companyMasterSchema = require("../model/companymaster");
var bannerSchema = require("../model/banner");
var customerMasterSchema = require("../model/customermaster");
var companyUserMasterSchema = require("../model/companyusermaster");
var adminLoginSchema = require("../model/adminlogin");
var companyInventoryMasterSchema = require("../model/companyinventorymaster");
var companyServicesProviderSchema = require("../model/companyservicesprovider");
var termnconditionSchema = require("../model/termncondition");
var bookingSlotMasterSchema = require("../model/bookingslotmaster");
var bookingMasterSchema = require("../model/booking");
var registrationFeesSchema = require('../model/registrationfees');

config = require("../config");

//image uploading
var membershiplocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/membership");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});
var uploadmembership = multer({ storage: membershiplocation });

var bannerlocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/banner");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});
var uploadbanner = multer({ storage: bannerlocation });

var businesscategorylocation = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/businesscategory");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});
var uploadbusinesscategory = multer({ storage: businesscategorylocation });

var filestorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/Document");
    },
    filename: function (req, file, cb) {
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

router.post("/adminSignUp", async function (req, res, next) {
    const { userName, password } = req.body;
    try {
        let newadmin = new adminLoginSchema({
            _id: new config.mongoose.Types.ObjectId(),
            userName: userName,
            password: password,
        });
        newadmin.save();
        res
            .status(200)
            .json({ Message: "Admin Registered!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/adminSignIn", async function (req, res, next) {
    const { userName, password } = req.body;
    try {
        let admin = await adminLoginSchema.find({
            userName: userName,
            password: password,
            isActive: true,
        });
        if (admin.length == 1) {
            res.status(200).json({
                Message: "admin  Login!",
                Data: admin,
                IsSuccess: true,
            });
        } else {
            res.status(200).json({
                Message: "invalid Data!",
                Data: admin,
                IsSuccess: true,
            });
        }
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/companySignIn", async function (req, res, next) {
    const { adminEmail, adminPassword } = req.body;
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

router.post("/addMembershipType", uploadmembership.single("registrationIcon"), async function (req, res, next) {
    const {
        membershipType,
        registrationFee,
        csgtPercent,
        sgstPercent,
        igstPercent,
        benefitList,
    } = req.body;
    try {
        const file = req.file;
        var membership = new membershipTypeMstSchema({
            _id: new config.mongoose.Types.ObjectId(),
            membershipType: membershipType,
            registrationFee: registrationFee,
            csgtPercent: csgtPercent,
            sgstPercent: sgstPercent,
            igstPercent: igstPercent,
            registrationIcon: file == undefined ? null : file.path,
            benefitList: benefitList,
        });
        membership.save();
        res
            .status(200)
            .json({ Message: "Membership Type Added!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/MembershipType", async function (req, res, next) {
    try {
        let data = await membershipTypeMstSchema.find();
        res
            .status(200)
            .json({ Message: " Membership Type Data!", Data: data, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/UpdateMembershipType", uploadmembership.single("registrationIcon"), async function (req, res, next) {
    try {
        const {
            id,
            membershipType,
            registrationFee,
            csgtPercent,
            sgstPercent,
            igstPercent,
            benefitList,
        } = req.body;
        const file = req.file;
        if (file == undefined) {
            var data = {
                membershipType: membershipType,
                registrationFee: registrationFee,
                csgtPercent: csgtPercent,
                sgstPercent: sgstPercent,
                igstPercent: igstPercent,
                benefitList: benefitList,
            };

            let datas = await membershipTypeMstSchema.findByIdAndUpdate(id, data);
        } else {
            var data = {
                membershipType: membershipType,
                registrationFee: registrationFee,
                csgtPercent: csgtPercent,
                sgstPercent: sgstPercent,
                igstPercent: igstPercent,
                registrationIcon: file.path,
                benefitList: benefitList,
            };
            let datas = await membershipTypeMstSchema.findByIdAndUpdate(id, data);
        }
        res.status(200).json({
            Message: "Membership Type Updated !",
            Data: 1,
            IsSuccess: true,
        });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/DeleteMembershipType", async function (req, res, next) {
    try {
        const { id } = req.body;
        let data = await membershipTypeMstSchema.findByIdAndRemove(id);
        res
            .status(200)
            .json({ Message: "Membership Type Deleted!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/addCategoryMaster", uploadbusinesscategory.single("businessIcon"), async function (req, res, next) {
    const {
        businessCategoryName,
        startDate,
        bookingAmt,
        clientAmt,
        refundAmt,
        csgtPercent,
        sgstPercent,
        igstPercent,
    } = req.body;
    try {
        const file = req.file;
        var categorymaster = new categoryMasterSchema({
            _id: new config.mongoose.Types.ObjectId(),
            businessCategoryName: businessCategoryName,
            startDate: startDate,
            bookingAmt: bookingAmt,
            clientAmt: clientAmt,
            refundAmt: refundAmt,
            csgtPercent: csgtPercent,
            sgstPercent: sgstPercent,
            igstPercent: igstPercent,
            businessIcon: file == undefined ? null : file.path,
        });
        await categorymaster.save();

        res
            .status(200)
            .json({ Message: "Category Master Added!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/CategoryMaster", async function (req, res, next) {
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

router.post("/updateCategoryMaster", uploadbusinesscategory.single("businessIcon"), async function (req, res, next) {
    try {
        const {
            id,
            businessCategoryName,
            startDate,
            bookingAmt,
            clientAmt,
            refundAmt,
            csgtPercent,
            sgstPercent,
            igstPercent,
        } = req.body;
        const file = req.file;
        if (file == undefined) {
            var data = {
                businessCategoryName: businessCategoryName,
                startDate: startDate,
                bookingAmt: bookingAmt,
                clientAmt: clientAmt,
                refundAmt: refundAmt,
                csgtPercent: csgtPercent,
                sgstPercent: sgstPercent,
                igstPercent: igstPercent,
            };
            let datas = await categoryMasterSchema.findByIdAndUpdate(id, data);
        } else {
            var data = {
                businessCategoryName: businessCategoryName,
                startDate: startDate,
                bookingAmt: bookingAmt,
                clientAmt: clientAmt,
                refundAmt: refundAmt,
                csgtPercent: csgtPercent,
                sgstPercent: sgstPercent,
                igstPercent: igstPercent,
                businessIcon: file.path,
            };
            let datas = await categoryMasterSchema.findByIdAndUpdate(id, data);
        }
        res.status(200).json({
            Message: "Category Master Updated !",
            Data: 1,
            IsSuccess: true,
        });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }

});

router.post("/deleteCategoryMaster", async function (req, res, next) {
    try {
        const { id } = req.body;
        let data = await categoryMasterSchema.findByIdAndRemove(id);
        res
            .status(200)
            .json({ Message: "Category Master Deleted!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/addCityMaster", async function (req, res, next) {
    try {
        const { id, cityCode, cityName, stateName, stateCode } = req.body;
        if (id == "0") {
            var citymaster = new cityMasterSchema({
                _id: new config.mongoose.Types.ObjectId(),
                cityCode: cityCode,
                cityName: cityName,
                stateName: stateName,
                stateCode: stateCode,
            });
            await citymaster.save();
        } else {
            var citymaster = {
                cityCode: cityCode,
                cityName: cityName,
                stateName: stateName,
                stateCode: stateCode,
            };
            let data = await cityMasterSchema.findByIdAndUpdate(id, citymaster);
        }
        res
            .status(200)
            .json({ Message: "City Master Added!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getCityMaster", async function (req, res, next) {
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

router.post("/deleteCityMaster", async function (req, res, next) {
    try {
        const { id } = req.body;
        let data = await cityMasterSchema.findByIdAndRemove(id);
        res
            .status(200)
            .json({ Message: "City Master Deleted!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/addCityBusinessCategory", async function (req, res, next) {
    try {
        const { id, businessCategoryId, startDate } = req.body;
        if (id == "0") {
            var citybusinesscategory = new cityBusinessCategorySchema({
                _id: new config.mongoose.Types.ObjectId(),
                businessCategoryId: businessCategoryId,
                startDate: startDate,
            });
            await citybusinesscategory.save();
        } else {
            var citybusinesscategory = {
                businessCategoryId: businessCategoryId,
                startDate: startDate,
            };
            let data = await cityBusinessCategorySchema.findByIdAndUpdate(
                id,
                citybusinesscategory
            );
        }
        res.status(200).json({
            Message: "City Business Category Added!",
            Data: 1,
            IsSuccess: true,
        });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getCityBusinessCategory", async function (req, res, next) {
    try {
        let data = await cityBusinessCategorySchema
            .find()
            .populate("businessCategoryId", " businessCategoryName");
        res.status(200).json({
            Message: "City Business Category Data!",
            Data: data,
            IsSuccess: true,
        });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/deleteCityBusinessCategory", async function (req, res, next) {
    try {
        const { id } = req.body;
        let data = await cityBusinessCategorySchema.findByIdAndRemove(id);
        res.status(200).json({
            Message: "City Business Category Deleted!",
            Data: 1,
            IsSuccess: true,
        });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/addCompanyMaster", fieldset, async function (req, res, next) {
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
    console.log(req.body);
    var a = Math.floor(100000 + Math.random() * 900000);
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
                personPhoto: req.files.personPhoto == undefined ?
                    null : req.files.personPhoto[0].path,
                aadharCard: req.files.aadharCard == undefined ?
                    null : req.files.aadharCard[0].path,
                panCard: req.files.panCard == undefined ? null : req.files.panCard[0].path,
                cancelledCheque: req.files.cancelledCheque == undefined ?
                    null : req.files.cancelledCheque[0].path,
                weekStartDay: weekStartDay,
                companyLogo: req.files.companyLogo == undefined ?
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

router.post("/updateCompanyMaster", fieldset, async function (req, res, next) {
    const {
        id,
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
        if (
            req.files.personPhoto == "undefined" &&
            req.files.aadharCard == "undefined" &&
            req.files.panCard == "undefined" &&
            req.files.cancelledCheque == "undefined" &&
            req.files.companyLogo == "undefined"
        ) {
            var datas = {
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
                weekStartDay: weekStartDay,
                cancellationPolicy: cancellationPolicy,
                companyHtmlPage: companyHtmlPage,
                registrationValidUpto: registrationValidUpto,
            };
            let data = await companyMasterSchema.findByIdAndUpdate(id, companyMaster);
        } else {
            var datas = {
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
                personPhoto: req.files.personPhoto == undefined ?
                    req.files.personPhoto : req.files.personPhoto[0].path,
                aadharCard: req.files.aadharCard == undefined ?
                    req.files.aadharCard : req.files.aadharCard[0].path,
                panCard: req.files.panCard == undefined ?
                    req.files.panCard : req.files.panCard[0].path,
                cancelledCheque: req.files.cancelledCheque == undefined ?
                    files.cancelledCheque : req.files.cancelledCheque[0].path,
                weekStartDay: weekStartDay,
                companyLogo: req.files.companyLogo == undefined ?
                    req.files.companyLogo : req.files.companyLogo[0].path,
                cancellationPolicy: cancellationPolicy,
                companyHtmlPage: companyHtmlPage,
                registrationValidUpto: registrationValidUpto,
            };
            let data = await companyMasterSchema.findByIdAndUpdate(id, companyMaster);
        }

        res.status(200).json({
            Message: "CompanyMaster Added!",
            Data: req.body,
            IsSuccess: true,
        });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getCompanyMaster", async function (req, res, next) {
    try {
        let data = await companyMasterSchema
            .find()
            .populate("businessCategoryId", " businessCategoryName")
            .populate("cityMasterId");
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

router.post("/deleteCompanyMaster", async function (req, res, next) {
    try {
        const { id } = req.body;
        let data = await companyMasterSchema.findByIdAndRemove(id);
        res
            .status(200)
            .json({ Message: "Company Master Deleted!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/addBanner", uploadbanner.single("image"), async function (
    req,
    res,
    next
) {
    const { id, title, description, expiryDate } = req.body;
    try {
        const file = req.file;
        if (id == "0") {
            var banner = new bannerSchema({
                _id: new config.mongoose.Types.ObjectId(),
                title: title,
                description: description,
                image: file == undefined ? null : file.path,
                expiryDate: expiryDate,
            });
            banner.save();
        } else {
            if (file == undefined) {
                var data = {
                    title: title,
                    description: description,
                    expiryDate: expiryDate,
                };
                let datas = await bannerSchema.findByIdAndUpdate(id, data);
            } else {
                var data = {
                    title: title,
                    description: description,
                    image: file.path,
                    expiryDate: expiryDate,
                };
                let datas = await bannerSchema.findByIdAndUpdate(id, data);
            }
        }
        res
            .status(200)
            .json({ Message: "Banner Added!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getBanner", async function (req, res, next) {
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

router.post("/deleteBanner", async function (req, res, next) {
    try {
        const { id } = req.body;
        let data = await bannerSchema.findByIdAndRemove(id);
        res
            .status(200)
            .json({ Message: "Banner Deleted!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getcustomer", async function (req, res, next) {
    try {
        let data = await customerMasterSchema.find();
        console.log(data);
        res
            .status(200)
            .json({ Message: "customer Data!", Data: data, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getCompanyUserMaster", async function (req, res, next) {
    const { companyId } = req.body;
    try {
        let data = await companyUserMasterSchema.find({ companyId: companyId });
        res.status(200).json({
            Message: "Company User Master Data!",
            Data: data,
            IsSuccess: true,
        });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/addCompanyUserMaster", async function (req, res, next) {
    const {
        id,
        companyId,
        userName,
        emailId,
        userPassword,
        userPin,
        userCategory,
        mobileNo,
    } = req.body;
    try {
        if (id == "0") {
            var companyUser = new companyUserMasterSchema({
                _id: new config.mongoose.Types.ObjectId(),
                companyId: companyId,
                userName: userName,
                emailId: emailId,
                mobileNo: mobileNo,
                userPassword: userPassword,
                userPin: userPin,
                userCategory: userCategory,
            });
            companyUser.save();
        } else {
            var companyUser = {
                companyId: companyId,
                userName: userName,
                emailId: emailId,
                mobileNo: mobileNo,
                userPassword: userPassword,
                userPin: userPin,
                userCategory: userCategory,
            };
            let data = await companyUserMasterSchema.findByIdAndUpdate(
                id,
                companyUser
            );
        }
        res
            .status(200)
            .json({ Message: "Company User Added!", Data: 1, IsSuccess: true });
    } catch {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/deleteCompanyUser", async function (req, res, next) {
    try {
        const { id } = req.body;
        let data = await companyUserMasterSchema.findByIdAndRemove(id);
        res
            .status(200)
            .json({ Message: "Company User Deleted!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/addInventoryAndServiceProvider", async function (req, res, next) {
    const {
        companyId,
        inventoryName,
        inventoryDescription,
        appointmentMinutes,
        multipleServiceProviderRequired,
        rateType,
        rateAmt,
        inventoryNotes1Name,
        inventoryNotes1,
        inventoryNotes2Name,
        inventoryNotes2,
        inventoryNotes3Name,
        inventoryNotes3,
        inventoryAvailable,
        serviceProvider,
    } = req.body;
    try {
        if (multipleServiceProviderRequired == false) {
            var companyInventory = new companyInventoryMasterSchema({
                _id: new config.mongoose.Types.ObjectId(),
                companyId: companyId,
                inventoryName: inventoryName,
                inventoryDescription: inventoryDescription,
                appointmentMinutes: appointmentMinutes,
                multipleServiceProviderRequired: multipleServiceProviderRequired,
                rateType: rateType,
                rateAmt: rateAmt,
                inventoryNotes1Name: inventoryNotes1Name,
                inventoryNotes1: inventoryNotes1,
                inventoryNotes2Name: inventoryNotes2Name,
                inventoryNotes2: inventoryNotes2,
                inventoryNotes3Name: inventoryNotes3Name,
                inventoryNotes3: inventoryNotes3,
                inventoryAvailable: true,
            });
            companyInventory.save();
        } else {
            var companyInventory = new companyInventoryMasterSchema({
                _id: new config.mongoose.Types.ObjectId(),
                companyId: companyId,
                inventoryName: inventoryName,
                inventoryDescription: inventoryDescription,
                appointmentMinutes: multipleServiceProviderRequired == true ? null : appointmentMinutes,
                multipleServiceProviderRequired: multipleServiceProviderRequired,
                rateType: multipleServiceProviderRequired == true ? null : rateType,
                rateAmt: multipleServiceProviderRequired == true ? null : rateAmt,
                inventoryNotes1Name: multipleServiceProviderRequired == true ? null : inventoryNotes1Name,
                inventoryNotes1: multipleServiceProviderRequired == true ? null : inventoryNotes1,
                inventoryNotes2Name: multipleServiceProviderRequired == true ? null : inventoryNotes2Name,
                inventoryNotes2: multipleServiceProviderRequired == true ? null : inventoryNotes2,
                inventoryNotes3Name: multipleServiceProviderRequired == true ? null : inventoryNotes3Name,
                inventoryNotes3: multipleServiceProviderRequired == true ? null : inventoryNotes3,
                inventoryAvailable: multipleServiceProviderRequired == true ? null : inventoryAvailable,
            });
            companyInventory.save();

            for (i = 0; i < serviceProvider.length; i++) {
                var companyServicesProvider = new companyServicesProviderSchema({
                    _id: new config.mongoose.Types.ObjectId(),
                    companyId: serviceProvider[i].companyId,
                    inventoryId: companyInventory._id,
                    serviceProviderName: serviceProvider[i].serviceProviderName,
                    serviceProviderDescription: serviceProvider[i].serviceProviderDescription,
                    appointmentMinutes: serviceProvider[i].appointmentMinutes,
                    rateType: serviceProvider[i].rateType,
                    rateAmt: serviceProvider[i].rateAmt,
                });
                await companyServicesProvider.save();
            }
        }
        res.status(200).json({ Message: "Data Added!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getInventoryAndServiceListByCompanyId", async function (
    req,
    res,
    next
) {
    try {
        const { companyId } = req.body;
        let data = await companyInventoryMasterSchema.find({
            companyId: companyId,
        });
        let datalist = [];
        for (let i = 0; i < data.length; i++) {
            var serviceProviders = [];
            if (data[i].multipleServiceProviderRequired == true) {
                serviceProviders = await companyServicesProviderSchema.find({
                    inventoryId: data[i].id,
                });
            }
            datalist.push({ Inventory: data[i], serviceProviders: serviceProviders });
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

router.post("/addTermNCondition", async function (req, res, next) {
    const { id, title, description } = req.body;
    try {
        if (id == "0") {
            var banner = new termnconditionSchema({
                _id: new config.mongoose.Types.ObjectId(),
                title: title,
                description: description,
            });
            banner.save();
        } else {
            var data = {
                title: title,
                description: description,
            };
            let datas = await termnconditionSchema.findByIdAndUpdate(id, data);
        }
        res
            .status(200)
            .json({ Message: "Term N Condition Added!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getTermNCondition", async function (req, res, next) {
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

router.post("/deleteTermNCondition", async function (req, res, next) {
    try {
        const { id } = req.body;
        let data = await termnconditionSchema.findByIdAndRemove(id);
        res
            .status(200)
            .json({ Message: "Term N Condition Deleted!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getSlot", async function (req, res, next) {
    const { companyId, inventoryId, serviceProviderId } = req.body;
    try {
        let data = await bookingSlotMasterSchema
            .find({
                companyId: companyId,
                inventoryId: inventoryId,
                $or: [{ serviceProviderId: serviceProviderId }],
            })
            .populate("inventoryId")
            .populate("serviceProviderId");
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

router.post("/addSlot", async function (req, res, next) {
    const {
        id,
        companyId,
        inventoryId,
        serviceProviderId,
        dayName,
        slotName,
        fromTime,
        toTime,
        appointmentCount,
        rate,
    } = req.body;
    try {
        if (serviceProviderId != null) {
            var slot = new bookingSlotMasterSchema({
                _id: new config.mongoose.Types.ObjectId(),
                companyId: companyId,
                inventoryId: inventoryId,
                serviceProviderId: serviceProviderId,
                dayName: dayName,
                slotName: slotName,
                fromTime: fromTime,
                toTime: toTime,
                appointmentCount: appointmentCount,
                rate: rate,
            });
        } else {
            var slot = new bookingSlotMasterSchema({
                _id: new config.mongoose.Types.ObjectId(),
                companyId: companyId,
                inventoryId: inventoryId,
                serviceProviderId: null,
                dayName: dayName,
                slotName: slotName,
                fromTime: fromTime,
                toTime: toTime,
                appointmentCount: appointmentCount,
                rate: rate,
            });
        }
        slot.save();
        res.status(200).json({ Message: "Slot Added!", Data: 1, IsSuccess: true });
    } catch {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/deleteSlot", async function (req, res, next) {
    try {
        const { id } = req.body;
        let data = await bookingSlotMasterSchema.findByIdAndDelete(id);
        res
            .status(200)
            .json({ Message: "Slot Deleted!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getBookingHistory", async function (req, res, next) {
    try {
        let data = await bookingMasterSchema
            .find({ status: "pending" })
            .populate("companyId")
            .populate("inventoryId")
            .populate("serviceProviderId")
            .populate("customerId");
        let datalist = [];
        var Complete = []; {
            Complete = await bookingMasterSchema
                .find({ status: "complete" })
                .populate("companyId")
                .populate("inventoryId")
                .populate("serviceProviderId")
                .populate("customerId");
        }
        var Cancelled = []; {
            Cancelled = await bookingMasterSchema
                .find({ status: "cancelled" })
                .populate("companyId")
                .populate("inventoryId")
                .populate("serviceProviderId")
                .populate("customerId");
        }
        var datas = await datalist.push({
            Pending: data,
            Complete: Complete,
            Cancelled: Cancelled,
        });
        if (datas != "null") {
            res
                .status(200)
                .json({ Message: "Data Found!", Data: datalist, IsSuccess: true });
        } else {
            res.status(200).json({
                Message: "Something Went Wrong ",
                Data: datalist,
                IsSuccess: true,
            });
        }
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/updateBookingCancel", async function (req, res, next) {
    const { bookingId, status } = req.body;
    try {
        let data = await bookingMasterSchema.find({ _id: bookingId });
        if (data.length == 1) {
            var dataa = {
                status: status,
            };
            let datas = await bookingMasterSchema.findByIdAndUpdate(bookingId, dataa);
        }
        res
            .status(200)
            .json({ Message: "Status Updated!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/sendNotification", async function (req, res, next) {
    const { companyId, type } = req.body;
    try {
        let datalist = [];
        if (type == "Customer") {
            let data = await bookingMasterSchema
                .find({ companyId: companyId })
                .populate("companyId")
                .populate("inventoryId")
                .populate("serviceProviderId")
                .populate("customerId");
            for (let i = 0; i < data.length; i++) {
                var name = data[i].customerId.firstName;
                var mobileNo = data[i].customerId.mobileNo;
                var fcmToken = data[i].customerId.fcmToken;
                datalist.push({ name: name, mobileNo: mobileNo, fcmToken: fcmToken });
            }
            if (datalist != "null") {
                res
                    .status(200)
                    .json({ Message: "Data Found!", Data: datalist, IsSuccess: true });
            } else {
                res
                    .status(200)
                    .json({ Message: "Something Went Wrong ", Data: 0, IsSuccess: true });
            }
        } else if (type == "Vendor") {
            let data = await companyUserMasterSchema.find({ companyId: companyId });
            for (let i = 0; i < data.length; i++) {
                var name = data[i].userName;
                var mobileNo = data[i].mobileNo;
                var fcmToken = data[i].fcmToken;
                datalist.push({ name: name, mobileNo: mobileNo, fcmToken: fcmToken });
            }
            if (datalist != "null") {
                res
                    .status(200)
                    .json({ Message: "Data Found!", Data: datalist, IsSuccess: true });
            } else {
                res
                    .status(200)
                    .json({ Message: "Something Went Wrong ", Data: 0, IsSuccess: true });
            }
        } else {
            res
                .status(200)
                .json({ Message: "Invalid Data ", Data: 0, IsSuccess: true });
        }
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/", async function (req, res, next) {
    const { title, message, type, data } = req.body;
    try {
        var payload = {
            notification: {
                title: title,
                body: message,
            },
            data: {},
        };
        var options = {
            priority: "high",
            timeToLive: 60 * 60 * 24,
        };

        for (let i = 0; i < data.length; i++) {
            config.firebase
                .messaging()
                .sendToDevice(data[0].fcmToken, payload, options)
                .then((doc) => {
                    console.log("Sending Notification");
                    console.log(doc);
                });
        }
    } catch (err) { }
});

router.post("/updateMembershipTypeIsAcitve", async function (req, res, next) {
    const { id, isActive } = req.body;
    try {
        let data = await membershipTypeMstSchema.find({ _id: id });
        if (data.length == 1) {
            var dataa = {
                isActive: isActive,
            };
            let datas = await membershipTypeMstSchema.findByIdAndUpdate(id, dataa);
        }
        res
            .status(200)
            .json({ Message: "isActive Updated!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/getregistrationFees", async function (req, res, next) {
    const { companyId } = req.body;
    try {
        let data = await registrationFeesSchema.find({ companyId: companyId });
        res.status(200).json({
            Message: " Registration Fees Data!",
            Data: data,
            IsSuccess: true,
        });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/addRegistrationFees", async function (req, res, next) {
    const {
        companyId,
        regDate,
        membershipTypeID,
        amtPaid,
        taxableValue,
        cGSTAmt,
        sGSTAmt,
        iGSTAmt,
        payThrough,
        payDateTime,
        transactionNo,
        billNo,
        billEmailed,
        EmailDateTime,
        regNo
    } = req.body;
    try {
        var registrationFees = new registrationFeesSchema({
            _id: new config.mongoose.Types.ObjectId(),
            companyId: companyId,
            regDate: regDate,
            membershipTypeID: membershipTypeID,
            amtPaid: amtPaid,
            taxableValue: taxableValue,
            cGSTAmt: cGSTAmt,
            sGSTAmt: sGSTAmt,
            iGSTAmt: iGSTAmt,
            payThrough: payThrough,
            payDateTime: payDateTime,
            transactionNo: transactionNo,
            billNo: billNo,
            billEmailed: billEmailed,
            EmailDateTime: EmailDateTime,
            regNo: regNo
        });
        registrationFees.save();
        res
            .status(200)
            .json({ Message: "Registration Fees Done Successfully!", Data: 1, IsSuccess: true });
    } catch {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/deleteRegistrationFees", async function (req, res, next) {
    try {
        const { id } = req.body;
        let data = await registrationFeesSchema.findByIdAndRemove(id);
        res
            .status(200)
            .json({ Message: "Registration Fees Deleted!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

module.exports = router;