var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");
// const bcrypt = require('bcrypt');
var membershipTypeMstSchema = require('../model/membershiptypemst');
var cityMasterSchema = require('../model/citymaster');
var categoryMasterSchema = require('../model/categorymaster');
var cityBusinessCategorySchema = require('../model/citybusinesscategory');
var companyMasterSchema = require('../model/companymaster');
var bannerSchema = require('../model/banner');
var customerMasterSchema = require('../model/customermaster');
var companyUserMasterSchema = require('../model/companyusermaster');
var adminLoginSchema = require('../model/adminlogin');


const config = require('../config');

//image uploading
var membershiplocation = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/membership");
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});
var uploadmembership = multer({ storage: membershiplocation });

var bannerlocation = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/banner");
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});
var uploadbanner = multer({ storage: bannerlocation });

var businesscategorylocation = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/businesscategory");
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});
var uploadbusinesscategory = multer({ storage: businesscategorylocation });

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


/* GET users listing. */

router.post('/adminSignUp', async function(req, res, next) {
    const { userName, password, role} = req.body;
    const saltRounds = 10; 
    try {
          var hash = await bcrypt.hash(password, saltRounds);
                    let newadmin = new adminLoginSchema({
                    _id: new config.mongoose.Types.ObjectId(),
                    userName: userName,
                    password: hash,
                    role: role,
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
   const { userName,password,role } = req.body; 
   try {
         let admin = await adminLoginSchema.find({
            userName: userName,
            role: role,
           isActive: true,
         });
     if (admin.length == 1) {
             var result = await bcrypt.compare(password, admin[0].password);
            if(result){
                res.status(200).json({
                    Message: "admin  Login!",
                    Data: admin,
                    IsSuccess: true,
                });
            }else{
                res.status(200).json({
                Message: "invalid Password!",
                Data: admin,
                IsSuccess: true,
                });
            }    
   } 
   else {
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

 
router.post('/addMembershipType', uploadmembership.single("registrationIcon"), async function(req, res, next) {
    const { membershipType, registrationFee, csgtPercent, sgstPercent, igstPercent, benefitList } = req.body;
    try {
        const file = req.file;
        var membership = new membershipTypeMstSchema({
            _id: new config.mongoose.Types.ObjectId,
            membershipType: membershipType,
            registrationFee: registrationFee,
            csgtPercent: csgtPercent,
            sgstPercent: sgstPercent,
            igstPercent: igstPercent,
            registrationIcon: file == undefined ? null : file.path,
            benefitList: benefitList
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

router.post('/MembershipType', async function(req, res, next) {
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

router.post('/UpdateMembershipType', uploadmembership.single("registrationIcon"), async function(req, res, next) {
    try {
        const { id, membershipType, registrationFee, csgtPercent, sgstPercent, igstPercent, benefitList } = req.body;
        const file = req.file;
        if (file == undefined) {
            var data = {
                membershipType: membershipType,
                registrationFee: registrationFee,
                csgtPercent: csgtPercent,
                sgstPercent: sgstPercent,
                igstPercent: igstPercent,
                benefitList: benefitList
            }

            let datas = await membershipTypeMstSchema.findByIdAndUpdate(id, data);
        } else {
            var data = {
                membershipType: membershipType,
                registrationFee: registrationFee,
                csgtPercent: csgtPercent,
                sgstPercent: sgstPercent,
                igstPercent: igstPercent,
                registrationIcon: file.path,
                benefitList: benefitList
            }
            let datas = await membershipTypeMstSchema.findByIdAndUpdate(id, data);
        }
        res
            .status(200)
            .json({ Message: "Membership Type Updated !", Data: 1, IsSuccess: true });

    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }

});

router.post('/DeleteMembershipType', async function(req, res, next) {
    try {
        const { id } = req.body;
        let data = await membershipTypeMstSchema.findOneAndRemove(id);
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

router.post('/addCategoryMaster', uploadbusinesscategory.single("businessIcon"), async function(req, res, next) {
    const { businessCategoryName, startDate, bookingAmt, clientAmt, refundAmt, csgtPercent, sgstPercent, igstPercent } = req.body;
    try {
        const file = req.file;
        var categorymaster = new categoryMasterSchema({
            _id: new config.mongoose.Types.ObjectId,
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

router.post('/CategoryMaster', async function(req, res, next) {
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

router.post('/updateCategoryMaster', uploadbusinesscategory.single("businessIcon"), async function(req, res, next) {
    try {
        const { id, businessCategoryName, startDate, bookingAmt, clientAmt, refundAmt, csgtPercent, sgstPercent, igstPercent } = req.body;
        const file = req.file;
        if (file == undefined) {
            var data = ({
                businessCategoryName: businessCategoryName,
                startDate: startDate,
                bookingAmt: bookingAmt,
                clientAmt: clientAmt,
                refundAmt: refundAmt,
                csgtPercent: csgtPercent,
                sgstPercent: sgstPercent,
                igstPercent: igstPercent
            });
            let datas = await categoryMasterSchema.findByIdAndUpdate(id, data);
        } else {
            var data = ({
                businessCategoryName: businessCategoryName,
                startDate: startDate,
                bookingAmt: bookingAmt,
                clientAmt: clientAmt,
                refundAmt: refundAmt,
                csgtPercent: csgtPercent,
                sgstPercent: sgstPercent,
                igstPercent: igstPercent,
                businessIcon: file.path
            });
            let datas = await categoryMasterSchema.findByIdAndUpdate(id, data);
        }
        res
            .status(200)
            .json({ Message: "Category Master Updated !", Data: 1, IsSuccess: true });

    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/deleteCategoryMaster', async function(req, res, next) {
    try {
        const { id } = req.body;
        let data = await categoryMasterSchema.findOneAndRemove(id);
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

router.post('/addCityMaster', async function(req, res, next) {
    try {
        const { id, cityCode, cityName, stateName, stateCode } = req.body;
        if (id == "0") {
            var citymaster = new cityMasterSchema({
                _id: new config.mongoose.Types.ObjectId,
                cityCode: cityCode,
                cityName: cityName,
                stateName: stateName,
                stateCode: stateCode
            });
            await citymaster.save();
        } else {
            var citymaster = ({
                cityCode: cityCode,
                cityName: cityName,
                stateName: stateName,
                stateCode: stateCode
            });
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

router.post('/getCityMaster', async function(req, res, next) {
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

router.post('/deleteCityMaster', async function(req, res, next) {
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

router.post('/addCityBusinessCategory', async function(req, res, next) {
    try {
        const { id, businessCategoryId, startDate } = req.body;
        if (id == "0") {
            var citybusinesscategory = new cityBusinessCategorySchema({
                _id: new config.mongoose.Types.ObjectId,
                businessCategoryId: businessCategoryId,
                startDate: startDate
            });
            await citybusinesscategory.save();
        } else {
            var citybusinesscategory = ({
                businessCategoryId: businessCategoryId,
                startDate: startDate
            });
            let data = await cityBusinessCategorySchema.findByIdAndUpdate(id, citybusinesscategory);
        }
        res
            .status(200)
            .json({ Message: "City Business Category Added!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/getCityBusinessCategory', async function(req, res, next) {
    try {
        let data = await cityBusinessCategorySchema.find().populate('businessCategoryId', ' businessCategoryName');
        res
            .status(200)
            .json({ Message: "City Business Category Data!", Data: data, IsSuccess: true });

    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/deleteCityBusinessCategory', async function(req, res, next) {
    try {
        const { id } = req.body;
        let data = await cityBusinessCategorySchema.findByIdAndRemove(id);
        res
            .status(200)
            .json({ Message: "City Business Category Deleted!", Data: 1, IsSuccess: true });

    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/addCompanyMaster', fieldset, async function(req, res, next) {
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
        registrationValidUpto
    } = req.body;
    var a = Math.floor(100000 + Math.random() * 900000);
    try {
        let existCompany = await companyMasterSchema.find({ companyName: companyName });
        if (existCompany.length == 1) {
          res.status(200).json({
            Message: "Company Name Already Registered!",
            Data: 0,
            IsSuccess: true,
          });
        }else{
            var companymaster = new companyMasterSchema({
                _id: new config.mongoose.Types.ObjectId,
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
                personPhoto: req.files.personPhoto == undefined ? null : req.files.personPhoto[0].path,
                aadharCard: req.files.aadharCard  == undefined ? null : req.files.aadharCard[0].path,
                panCard:  req.files.panCard  == undefined ? null : req.files.panCard[0].path,
                cancelledCheque: req.files.cancelledCheque  == undefined ? null : req.files.cancelledCheque[0].path,
                weekStartDay: weekStartDay,
                companyLogo:  req.files.companyLogo  == undefined ? null : req.files.companyLogo[0].path,
                cancellationPolicy: cancellationPolicy,
                companyHtmlPage: companyHtmlPage,
                registrationValidUpto: registrationValidUpto
            });
            companymaster.save();
            res
                .status(200)
                .json({ Message: "Company Master Added!", Data: req.body, IsSuccess: true });
        }
        
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/updateCompanyMaster', fieldset, async function(req, res, next) {
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
        registrationValidUpto
    } = req.body;
    try {
        if(req.files.personPhoto == "undefined" && req.files.aadharCard == "undefined" && req.files.panCard == "undefined" && req.files.cancelledCheque == "undefined" && req.files.companyLogo == "undefined"  ){
            var datas =({
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
                registrationValidUpto: registrationValidUpto
            });
            let data = await companyMasterSchema.findByIdAndUpdate(id, companyMaster);
        }else{
            var datas =({
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
                personPhoto: req.files.personPhoto[0].path,
                aadharCard: req.files.aadharCard[0].path,
                panCard: req.files.panCard[0].path,
                cancelledCheque: req.files.cancelledCheque[0].path,
                weekStartDay: weekStartDay,
                companyLogo: req.files.companyLogo[0].path,
                cancellationPolicy: cancellationPolicy,
                companyHtmlPage: companyHtmlPage,
                registrationValidUpto: registrationValidUpto
            });
            let data = await companyMasterSchema.findByIdAndUpdate(id, companyMaster);
        }
        
        res
            .status(200)
            .json({ Message: "CompanyMaster Added!", Data: req.body, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/getCompanyMaster', async function(req, res, next) {
    try {
        let data = await companyMasterSchema.find().populate('businessCategoryId', ' businessCategoryName').populate('cityMasterId');
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

router.post('/deleteCompanyMaster', async function(req, res, next) {
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

router.post('/addbanner', uploadbanner.single("image"), async function(req, res, next) {
    const { id, title, description } = req.body;
    try {
        const file = req.file;
        if (id == "0") {
            var banner = new bannerSchema({
                _id: new config.mongoose.Types.ObjectId,
                title: title,
                description: description,
                image: file == undefined ? null : file.path
            });
            banner.save();
        } else {
            if (file == undefined) {
                var data = {
                    title: title,
                    description: description
                }
                let datas = await bannerSchema.findByIdAndUpdate(id, data);
            } else {
                var data = {
                    title: title,
                    description: description,
                    image: file.path
                }
                let datas = await bannerSchema.findByIdAndUpdate(id, data);
            }
        }
        res
            .status(200)
            .json({ Message: "Banner Added!", Data:1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/getbanner', async function(req, res, next) {
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

router.post('/deletebanner', async function(req, res, next) {
    try {
        const { id } = req.body;
        let data = await bannerSchema.findOneAndRemove(id);
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

router.post('/getcustomer', async function(req, res, next) {
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

router.post('/getCompanyUserMaster', async function(req, res, next) {
    const  {companyId} = req.body
    try {
        let data = await companyUserMasterSchema.find({companyId:companyId});
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

router.post('/addCompanyUserMaster', async function(req,res,next){
    const {id,companyId,userName,emailId,userPassword,userPin,userCategory} = req.body;
    const saltRounds = 10; 
    try{
        var hash = await bcrypt.hash(userPassword, saltRounds);
        if(id == "0")
        {
            var companyUser = new companyUserMasterSchema({
                _id: new config.mongoose.Types.ObjectId,
                companyId:companyId,
                userName:userName,
                emailId:emailId,
                userPassword:hash,
                userPin:userPin,
                userCategory:userCategory
            });
            companyUser.save();
        }else{
            var companyUser = ({
                companyId:companyId,
                userName:userName,
                emailId:emailId,
                userPassword:hash,
                userPin:userPin,
                userCategory:userCategory
            });
            let data = await companyUserMasterSchema.findByIdAndUpdate(id,companyUser)
        }
        res
                .status(200)
                .json({ Message: "Company User Added!", Data:req.body, IsSuccess: true });
        
    }catch{
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }

});

router.post('/deletecompanyUser', async function(req,res,next){

});
module.exports = router;