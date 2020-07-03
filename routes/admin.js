var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");
var membershipTypeMstSchema = require('../model/membershiptypemst');
var cityMasterSchema = require('../model/citymaster');
var categoryMasterSchema = require('../model/categorymaster');
var cityBusinessCategorySchema = require('../model/citybusinesscategory');
var companyMasterSchema = require('../model/companymaster');

const config = require('../config');
const { populate } = require('../model/companymaster');

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

var Documentlocation = multer.diskStorage({
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
var uploaddocument = multer({ storage: Documentlocation });


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
  { name: "aadharCard", maxCount: 2 },
  { name: "panCard", maxCount: 2 },
  { name: "cancelledCheque", maxCount: 1 },
  { name: "companyLogo", maxCount: 1 },
 ]);


/* GET users listing. */
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
        const { membershipType, registrationFee, csgtPercent, sgstPercent, igstPercent, benefitList } = req.body;
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
<<<<<<< HEAD
module.exports = router;
=======

router.post('/addCompanyMaster',fieldset, async function (req, res, next) {
  const {doj,businessCategoryId,companyName,addressLine1,addressLine2,cityMasterId,zipcode,mapLocation,phone,fax,url,supportEmail,adminEmail,adminMobile,adminPassword,gstinNo,paNo,bankName,bankBranchName,bankAddress
    ,bankCity,bankState,bankAccountNo,bankIfscCode,companyType,personName,weekStartDay,cancellationPolicy,companyHtmlPage,registrationValidUpto } = req.body;
    var a = Math.floor(100000 + Math.random() * 900000); 
    try {
    var companymaster = new companyMasterSchema({
      _id: new config.mongoose.Types.ObjectId,
      companyCode: "comp" + a,
      doj: doj,
      businessCategoryId: businessCategoryId,
      companyName: companyName,
      addressLine1: addressLine1,
      addressLine2:addressLine2,
      cityMasterId:cityMasterId,
      zipcode:zipcode,
      mapLocation:mapLocation,
      phone:phone,
      fax:fax,
      url:url,
      supportEmail:supportEmail,
      adminEmail:adminEmail,
      adminMobile:adminMobile,
      adminPassword:adminPassword,
      gstinNo:gstinNo,
      paNo:paNo,
      bank:{
          bankName:bankName,
          bankBranchName:bankBranchName,
          bankAddress:bankAddress,
          bankCity:bankCity,
          bankState:bankState,
          bankAccountNo:bankAccountNo,
          bankIfscCode:bankIfscCode,
      },
      companyType:companyType,
      personName:personName,
      personPhoto: req.files.personPhoto[0].path,
      aadharCard: req.files.aadharCard[0].path,
      panCard : req.files.panCard[0].path,
      cancelledCheque: req.files.cancelledCheque[0].path,
      weekStartDay:weekStartDay,
      companyLogo: req.files.companyLogo[0].path,
      cancellationPolicy:cancellationPolicy,
      companyHtmlPage:companyHtmlPage,
      registrationValidUpto:registrationValidUpto
    });
     companymaster.save();
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

router.post('/getCompanyMaster', async function(req,res,next){
  try{
    let data = await companyMasterSchema.find().populate('businessCategoryId',' businessCategoryName',populate('cityMasterId','cityName','stateName','stateCode'));
   res
   .status(200)
   .json({ Message: "Company Master Data!", Data: data, IsSuccess: true });
 
 }catch (err) {
   res.json({
     Message: err.message,
     Data: 0,
     IsdSuccess: false,
   });
 }
});

router.post('/deleteCompanyMaster',async function(req,res,next){
  try{
    const {id} = req.body;
    let data = await companyMasterSchema.findByIdAndRemove(id);
    res
    .status(200)
    .json({ Message: "Company Master Deleted!", Data: 1, IsSuccess: true });
  
  }catch (err) {
    res.json({
      Message: err.message,
      Data: 0,
      IsdSuccess: false,
    });
  }
});

router.post('/updateCategoryMaster',async function(req,res,next){
  try{
    const {id,doj,businessCategoryId,companyName,addressLine1,addressLine2,cityMasterId,zipcode,mapLocation,phone,fax,url,supportEmail,adminEmail,adminMobile,adminPassword,gstinNo,paNo,bankName,bankBranchName,bankAddress
      ,bankCity,bankState,bankAccountNo,bankIfscCode,companyType,personName,weekStartDay,cancellationPolicy,companyHtmlPage,registrationValidUpto } = req.body;
    
      var data = ({
        businessCategoryName:businessCategoryName,
        startDate:startDate,
        bookingAmt:bookingAmt,
        clientAmt:clientAmt,
        refundAmt:refundAmt,
        csgtPercent:csgtPercent,
        sgstPercent:sgstPercent,
        igstPercent:igstPercent
       });
       let datas = await companyMasterSchema.findByIdAndUpdate(id,data);
    res
    .status(200)
    .json({ Message: "Company Master Updated !", Data: 1, IsSuccess: true });
  
  }catch (err) {
    res.json({
      Message: err.message,
      Data: 0,
      IsdSuccess: false,
    });
  }
  });

module.exports = router;
>>>>>>> f424b9075edceb7526a93e9fe8e5cde88e09a5b9
