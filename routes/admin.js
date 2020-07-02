var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");
var membershipTypeMstSchema = require('../model/membershiptypemst');

var categoryMasterSchema = require('../model/categorymaster');
const config = require('../config');

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


/* GET users listing. */
router.post('/addMembershipType', uploadmembership.single("registrationIcon"), async function (req, res, next) {
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


router.post('/MembershipType', async function(req,res,next){
  try{
    const { membershipType, registrationFee, csgtPercent, sgstPercent, igstPercent, benefitList } = req.body;
      let data = await  membershipTypeMstSchema.find();
      res
      .status(200)
      .json({ Message: " Membership Type Data!", Data: data, IsSuccess: true });

  }catch (err) {
    res.json({
      Message: err.message,
      Data: 0,
      IsdSuccess: false,
    });
  }
});


router.post('/UpdateMembershipType',uploadmembership.single("registrationIcon"), async function(req,res,next){
    try{
      const { id,membershipType, registrationFee, csgtPercent, sgstPercent, igstPercent, benefitList } = req.body;
      const file = req.file;
        if(file == undefined){
          var data = {
            membershipType: membershipType,
            registrationFee: registrationFee,
            csgtPercent: csgtPercent,
            sgstPercent: sgstPercent,
            igstPercent: igstPercent,
            benefitList: benefitList
          }
          
          let datas = await  membershipTypeMstSchema.findByIdAndUpdate(id,data);
        }
        else{
          var data = {
            membershipType: membershipType,
            registrationFee: registrationFee,
            csgtPercent: csgtPercent,
            sgstPercent: sgstPercent,
            igstPercent: igstPercent,
            registrationIcon:file.path,
            benefitList: benefitList
          }
          let datas = await membershipTypeMstSchema.findByIdAndUpdate(id,data);
        }
        res
        .status(200)
        .json({ Message: "Membership Type Updated !", Data: 1, IsSuccess: true });
  
    }catch (err) {
      res.json({
        Message: err.message,
        Data: 0,
        IsdSuccess: false,
      });
    }

});

router.post('/DeleteMembershipType', async function(req,res,next){
  try{
    const {id} = req.body;
      let data = await  membershipTypeMstSchema.findOneAndRemove(id);
      res
      .status(200)
      .json({ Message: "Membership Type Deleted!", Data: 1, IsSuccess: true });

  }catch (err) {
    res.json({
      Message: err.message,
      Data: 0,
      IsdSuccess: false,
    });
  }
});


router.post('/addCategoryMaster',uploadbusinesscategory.single("businessIcon"), async function(req,res,next){
 const {businessCategoryName,startDate,bookingAmt,clientAmt,refundAmt,csgtPercent,sgstPercent,igstPercent} = req.body;
 try{
  const file = req.file;
  var categorymaster = new categoryMasterSchema ({
   _id:new config.mongoose.Types.ObjectId,
   businessCategoryName:businessCategoryName,
   startDate:startDate,
   bookingAmt:bookingAmt,
   clientAmt:clientAmt,
   refundAmt:refundAmt,
   csgtPercent:csgtPercent,
   sgstPercent:sgstPercent,
   igstPercent:igstPercent,
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


router.post('/CategoryMaster', async function(req,res,next){
  try{
    const {businessCategoryName,startDate,bookingAmt,clientAmt,refundAmt,csgtPercent,sgstPercent,igstPercent} = req.body;
    let data = await categoryMasterSchema.find();
    res
      .status(200)
      .json({ Message: "Catergory Master Data!", Data: data, IsSuccess: true });

  }catch (err) {
    res.json({
      Message: err.message,
      Data: 0,
      IsdSuccess: false,
    });
  }
});

router.post('/updateCategoryMaster',uploadbusinesscategory.single("businessIcon"),async function(req,res,next){
try{
  const {id,businessCategoryName,startDate,bookingAmt,clientAmt,refundAmt,csgtPercent,sgstPercent,igstPercent} = req.body;
  const file = req.file;
  if(file == undefined){
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
     let datas = await categoryMasterSchema.findByIdAndUpdate(id,data);
  }
  else{
    var data = ({
      businessCategoryName:businessCategoryName,
      startDate:startDate,
      bookingAmt:bookingAmt,
      clientAmt:clientAmt,
      refundAmt:refundAmt,
      csgtPercent:csgtPercent,
      sgstPercent:sgstPercent,
      igstPercent:igstPercent,
      businessIcon:file.path
     });
     let datas = await categoryMasterSchema.findByIdAndUpdate(id,data);
  }
  res
  .status(200)
  .json({ Message: "Category Master Updated !", Data: 1, IsSuccess: true });

}catch (err) {
  res.json({
    Message: err.message,
    Data: 0,
    IsdSuccess: false,
  });
}
});

router.post('/deleteCategoryMaster',async function(req,res,next){
  try{
    const {id} = req.body;
      let data = await  categoryMasterSchema.findOneAndRemove(id);
      res
      .status(200)
      .json({ Message: "Category Master Deleted!", Data: 1, IsSuccess: true });

  }catch (err) {
    res.json({
      Message: err.message,
      Data: 0,
      IsdSuccess: false,
    });
  }
});

module.exports = router;
