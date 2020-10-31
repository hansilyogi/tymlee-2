var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");
var mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const moment = require('moment');

var companyMasterSchema = require("../model/companymaster");
var cityMasterSchema = require("../model/citymaster");
var categoryMasterSchema = require("../model/categorymaster");
var bookingMasterSchema = require("../model/booking");
var customerMasterSchema = require("../model/customermaster");
var companyInventoryMaster = require('../model/companyinventorymaster')
var companyServicesProviderSchema = require("../model/companyservicesprovider");
const { ObjectId } = require('mongodb');
let commonController = require('./common')
var a = Math.floor(100000 + Math.random() * 900000);
var rootDir = path.normalize(__dirname + '../../../');
var _uploader = multer({
    dest: path.join(rootDir, 'tmp'),
    // maxCount: config.uploads.maxCount,
    // limits: { // 1GB
    //   fieldSize: 1048576000,
    //   fileSize: 1048576000
    // }
  });

const config = require("../config");
const {appConfig} = require('../app_config');
const { forEach } = require("lodash");
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


var storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '');
    }
});
var multipleUpload = multer({  dest: path.join(appConfig.root, 'tmp')}).array('file');
var upload = multer({ storage: storage }).single('file');

/* APIS listing. */

router.get("/getInventories/:companyId", async function(req, res, next) {
    const { companyId } = req.params;
    try {
        if (!companyId) throw new Error('Invalid vendor.')
        let companyUser = await companyInventoryMaster.find({companyId: companyId.toString()});
        if (companyUser) {
            res.status(200).json({
                Message: "Inventories",
                Data: companyUser,
                IsSuccess: true,
            });
        } else {
            res.status(200).json({
                Message: "Invalid Data!",
                // Data: Customer,
                IsSuccess: false,
            });
        }
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.get("/serviceProvider/:companyId", async function (req, res, next) {
    const { companyId } = req.params;
    try {
        if (!companyId) { throw new Error('Invalid CompanyId') }
        let filter = { companyId: ObjectId(companyId) };
        filter.serviceProviderAvailable = true;
        // console.log(JSON.stringify(JSON.stringify(filter)))
        let ss = await companyServicesProviderSchema.find(filter)
            .populate('companyId', '_id personName personPhoto companyName companyType active gstinNo addressLine1 addressLine2 cityMasterId companyCode mapLocation adminMobile businessCategoryId cancellationPolicy companyLogo phone weekStartDay zipcode lat long')
            .populate('inventoryId').lean();
        // console.log(ss)
        if (ss && ss.length) {
            await Promise.all(
                ss.map(async (item, i) => {
                    let booking = await bookingMasterSchema.count({
                        serviceProviderId: item._id, //ObjectId(),
                        bookingDate: {
                            $gte: moment().startOf('day').format(),
                            $lt: moment().endOf('day').format(),
                        }
                    });
                    return { ...item, todaysBooking: booking }
                })
            ).then(d => {
                res.status(200)
                    .json({ Message: "Data Found!", Data: d, IsSuccess: true });
            })
        } else {
            res.status(200)
                .json({ Message: "Data Found!", Data: ss, IsSuccess: true });
        }
    } catch (err) {
        console.log(err)
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});
router.get("/profile/:vendorId", async function(req, res, next) {
    const { vendorId } = req.params;
    try {
        let company = await companyMasterSchema.findById({_id: vendorId, active: true});
                res.status(200).json({
                    Message: "vendor profile.",
                    Data: company,
                    IsSuccess: true,
                });
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});
router.get("/customer", async function (req, res, next) {
    try {
        let { searchVal } = req.query;
        if (!searchVal) throw new Error('InvalidSearch Value!');
        let findParams = {};
        findParams.$or = [
            { mobileNo: new RegExp(searchVal, 'i') },
            { firstName: new RegExp(searchVal, 'i') },
            { lastName: new RegExp(searchVal, 'i') },
            { emailID: new RegExp(searchVal, 'i') }
        ];
        let customers = await customerMasterSchema.find(
            findParams
        ).select('_id mobileNo firstName lastName emailID address1 address2 city state zipcode');
        res.status(200).json({
            Message: "customer data",
            Data: customers,
            IsSuccess: true,
        })
    } catch (err) {
        res.json({
            Message: err.message || err,
            IsSuccess: false,
        });
    }
})
router.get("/company-customer/:companyId/:name", async function (req, res, next) {
    try {
        let { companyId, name } = req.params;
        if (!companyId) throw new Error('Invalid companyId!');
        let bookingCustomer = await bookingMasterSchema.find({
            companyId: ObjectId(companyId),   
        })
        .populate('companyId', '_id companyName addressLine1 addressLine2 companyLogo notes phone mapLocation')
        .populate('inventoryId', '_id inventoryName rateAmt inventoryDescription')
        .populate('serviceProviderId', '_id serviceProviderName serviceProviderDescription rateAmt')
        .populate('bookingSlotId', '_id dayName slotName fromTime toTime rate')
        .populate({
            path: 'customerId',
            select: '_id mobileNo firstName lastName emailID address1 address2 city state zipcode imageAttachment',
            match: {
                $or: [
                    {firstName: new RegExp(name.toLowerCase(), "i")},
                    {lastName: new RegExp(name.toLowerCase(), "i")}
                ]
            },
        });
        let customers;
        if (bookingCustomer && bookingCustomer.length) {
            customers = bookingCustomer.filter(data => data.customerId)
        }
        // .select('_id mobileNo firstName lastName emailID address1 address2 city state zipcode');
        res.status(200).json({
            Message: "company customer data",
            Data: customers,
            IsSuccess: true,
        })
    } catch (err) {
        res.json({
            Message: err.message || err,
            IsSuccess: false,
        });
    }
})
router.post("/getAppointmentByDate", async function(req, res, next) {
    try {

        let data = await bookingMasterSchema
        .find({ status: "pending" })
        .populate("companyId")
        .populate("inventoryId")
        .populate("serviceProviderId")
        .populate("customerId");
        res.status(200).json({
            Message: "",
            Data: req.params,
            IsSuccess: true,
        });
    }catch(err) {
        console.log(err)
        res.json({
            Message: err.message || err,
            IsSuccess: false,
        });
    }
})

router.post("/VendorSignUp", _uploader.fields([
    { name: 'personPhoto', maxCount: 1 },
    { name: 'companyLogo', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'cancelledCheque', maxCount: 1 },
    { name: 'aadharCard', maxCount: 1 }
]), async function (req, res, next) {
    try {
        let existCompany = await companyMasterSchema.find({
            companyName: req.body.companyName,
        });
        if (existCompany.length >= 1) {
            throw new Error('Company already Exist!')
        }
        let requestedData = {
            bank: {
                bankName: req.body.bankName,
                bankBranchName: req.body.bankBranchName,
                bankAddress: req.body.bankAddress,
                bankCity: req.body.bankCity,
                bankState: req.body.bankState,
                bankAccountNo: req.body.bankAccountNo,
                bankIfscCode: req.body.bankIfscCode,
            },
        }
        if (!req.files.personPhoto || !req.files.companyLogo || !req.files.panCard || !req.files.cancelledCheque || !req.files.aadharCard) {
            console.log('in error re', req)
            return next('No files was attached!');
        }
        let files = [];
        files = files.concat(req.files.personPhoto);
        files = files.concat(req.files.companyLogo)
        files = files.concat(req.files.panCard)
        files = files.concat(req.files.cancelledCheque)
        files = files.concat(req.files.aadharCard)
        commonController.uploadDocuments(files, Object.keys(req.files)).then(async e => {
            let attachmentData = {}
            e.map((item, i) => {
                let keys = Object.keys(req.files)
                var attachmentKey = `${keys[i]}Attachment`;
                attachmentData[keys[i]] = `customer/getImage/${item._id}` //item.path;
                attachmentData[attachmentKey] = item._id;
                // companyLogo,
                // companyLogoAttachment,
                // personPhoto,
                // personPhotoAttachment,
                // panCard,
                // panCardAttachment,
                // cancelledCheque,
                // cancelledChequeAttachment,
            });
            var a = Math.floor(100000 + Math.random() * 900000);
            let companyData = { ...req.body, ...requestedData, ...attachmentData, companyCode: "comp" + a };

            var companymaster = new companyMasterSchema({
                _id: new config.mongoose.Types.ObjectId(),
                ...companyData
            });
            let companyDoc = await companymaster.save();
            res.status(200).json({
                IsdSuccess: true,
                companyDoc
            })
        })
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
            adminEmail: adminEmail.toLowerCase(),
            adminPassword: adminPassword,
            active: true,
        });
        if (company.length == 1) {
            if (company[0].active && moment().isBefore(moment(company[0].registrationValidUpto).format('YYYY-MM-DD'))) {
                res.status(200).json({
                    Message: "company  Login!",
                    Data: company,
                    IsSuccess: true,
                });
            } else {
                throw new Error('Your account is deactivated or else validation expired')
            }
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
router.post("/changePassword", async function(req, res, next) {
    const { _id, password,confirmPassword } = req.body;
    try {
        if (!_id) throw new Error('Invalid vendor.')
        let companyUser = await companyMasterSchema.findOne(JSON.parse(JSON.stringify({_id})));
        if (companyUser) {
            companyUser.adminPassword = password;
            await companyUser.save();
            res.status(200).json({
                Message: "New Password set successfully",
                IsSuccess: true,
            });
        } else {
            res.status(200).json({
                Message: "Invalid Data!",
                // Data: Customer,
                IsSuccess: false,
            });
        }
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/getCity", async function(req, res, next) {
    try {
        let data = await cityMasterSchema.find({status: true});
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
        let data = await categoryMasterSchema.find({isActive: true});
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

router.post("/getAllCustomer", async function(req, res, next) {
    try {
        let customer = await bookingMasterSchema.find({ companyId: req.body.companyId }).distinct('customerId');
        let customerData = await customerMasterSchema.find({ _id: { $in: customer } });
        let data = [];
        for (let obj of customerData) {
            let appointments = await bookingMasterSchema.find({ companyId: req.body.companyId, customerId: obj._id })
                .populate('customerId')
                .populate('inventoryId')
                .populate('serviceProviderId')
                .populate('bookingSlotId');
            obj.set('appointments', appointments, { strict: false });
            data.push(obj);
        }
        res
            .status(200)
            .json({ Message: "All Customers Data!", Data: data, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getTodayAppointment", async function(req, res, next) {
    try {
        let {companyId, serviceProviderId} = req.body;
        if (!companyId ) throw new Error('Invalid Company!')
        console.log('start', moment().startOf('day').format(), 'end', moment().endOf('day').format())
        let filter = {
            companyId: companyId,
            bookingDate: {
                $gte: moment().startOf('day').format(),
                $lt: moment().endOf('day').format(),
            }
        }
        if (serviceProviderId) {
            filter.serviceProviderId = serviceProviderId
        }
        let data = await bookingMasterSchema.find(filter).populate('customerId').populate('inventoryId').populate('serviceProviderId').populate('bookingSlotId');
        res
            .status(200)
            .json({ Message: "All Appointment Data!", Data: data, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getAllAppointment", async function(req, res, next) {
    try {
        let {companyId, bookingDate, activityStatus} = req.body;
        if (!companyId) {
            throw new Error('Invalid Company!')
        }
        if (bookingDate) {
            bookingDate = {
                // $gte: "2020-09-30T00:00:00.000Z",
                // $lt: "2020-09-30T23:59:00.000Z"
                $gte:moment(bookingDate).startOf('day').format(),
                $lt: moment(bookingDate).endOf('day').format(),
            }
        } else {
            bookingDate = undefined
        }
        
        let condition = JSON.parse(JSON.stringify({companyId, bookingDate, activityStatus}));
        condition.status = {$ne: 'cancel'}
        let data = await bookingMasterSchema.find(condition)
        .select('_id status activityStatus customerId inventoryId serviceProviderId bookingSlotId appointmentDate appointmentTime mobileNo specialRequest totalAmt taxableValue cgstAmt sgstAmt igstAmt payDateTime transactionNo billNo')
        .populate('customerId', '_id mobileNo firstName lastName isActive')
        .populate('inventoryId', '_id inventoryName inventoryDescription')
        .populate('serviceProviderId', '_id serviceProviderName serviceProviderDescription')
        .populate('bookingSlotId', '_id dayName slotName fromTime toTime rate');
        res
            .status(200)
            .json({ Message: "All Appointment Data!", Data: data, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getBookingReports", async function(req, res, next) {
    try {
        let {companyId, from, to} = req.body;
        if (!companyId || !from || !to) {
            throw new Error('Invalid Company or Dates!')
        }
        if (from && to) {
            bookingDate = {
                // $gte: "2020-09-30T00:00:00.000Z",
                // $lt: "2020-09-30T23:59:00.000Z"
                $gte:moment(from).startOf('day').format(),
                $lt: moment(to).endOf('day').format(),
            }
        }
        let condition = JSON.parse(JSON.stringify({companyId, bookingDate}));
        condition.status = {$ne: 'cancel'}
        let data = await bookingMasterSchema.find(condition)
        .select('_id status activityStatus customerId inventoryId serviceProviderId bookingSlotId appointmentDate appointmentTime mobileNo specialRequest totalAmt taxableValue cgstAmt sgstAmt igstAmt payDateTime transactionNo billNo')
        .populate('customerId', '_id mobileNo firstName lastName isActive')
        .populate('inventoryId', '_id inventoryName inventoryDescription')
        .populate('serviceProviderId', '_id serviceProviderName serviceProviderDescription')
        .populate('bookingSlotId', '_id dayName slotName fromTime toTime rate');
        res
            .status(200)
            .json({ Message: "All Appointment Data!", Data: data, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/updateCustomerStatus", async function(req, res, next) {
    try {
        let { _id, status, activityStatus, amount, totalAmt, taxableValue} = req.body;
        if (!_id) {
            throw new Error('Invalid data Passed, Booking required and pass status or activity status!')
        }
        let booking = await bookingMasterSchema.findOne({_id});
        if (booking) {
            if (booking.status) {
                booking.status = status;
            } 
            if (activityStatus) {
                booking.activityStatus = activityStatus;
                if (activityStatus.toLocaleLowerCase() == 'completed') {
                    booking.amount = amount || 0,
                    booking.taxableValue = taxableValue || 0,
                    booking.totalAmt = totalAmt || 0,
                    booking.status = 'Completed';
                    booking.serviceCompletedTime = new Date()
                } else if (activityStatus.toLocaleLowerCase() == 'arrived') {
                    booking.status = 'Arrived';
                    booking.serviceStartedTime = new Date()
                } else if (activityStatus.toLocaleLowerCase() == 'started') {
                    booking.status = 'Started';
                    // booking.serviceCompletedTime = new Date()
                } else if (activityStatus.toLocaleLowerCase() == 'no show') {
                    booking.status = 'No Show';
                    // booking.serviceCompletedTime = new Date()
                } 
            }
            await booking.save()
            res
                .status(200)
                .json({ Message: "Booking Status updated!", Data: booking, IsSuccess: true });
        } else {
            throw new Error('Booking not found!')
        }
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsSuccess: false,
        });
    }
});

router.post("/deactivateAccount", async function(req, res, next) {
    try {
        let {_id} = req.body;
        if (!_id) {
            throw new Error('Invalid data Passed, Company is required!')
        }
        let vendor = await companyMasterSchema.findOne({_id});
        if (vendor) {
            vendor.active = false;
            await vendor.save()
            res
                .status(200)
                .json({ Message: "vendor status updated!", Data: {id: vendor._id, isActive: vendor.active}, IsSuccess: true });
        } else {
            throw new Error('vendor not found!')
        }
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsSuccess: false,
        });
    }
});

router.post("/inventory", async function(req, res, next) {
    
    let {inventoryName, inventoryDescription, companyId} = req.body;
    let {_id, id, multipleServiceProviderRequired, appointmentMinutes, rateType, rateAmt, inventoryNotes1Name, inventoryNotes1, inventoryNotes2Name, inventoryNotes2, inventoryNotes3Name, inventoryNotes3, inventoryAvailable } = req.body;
    try {
        if (!inventoryName || !inventoryDescription || !companyId) throw new Error('Invalid inventory!')
        let data = JSON.parse(JSON.stringify({multipleServiceProviderRequired, companyId, inventoryName, inventoryDescription, appointmentMinutes, rateType, rateAmt, inventoryNotes1Name, inventoryNotes1, inventoryNotes2Name, inventoryNotes2, inventoryNotes3Name, inventoryNotes3, inventoryAvailable}));
        id = _id || id || new config.mongoose.Types.ObjectId(),
        console.log(id)
        let ic = await companyInventoryMaster.findOneAndUpdate({_id: id}, data, {upsert: true, new : true});
        if (ic) {
            res.status(200).json({
                Message: "inventory updated",
                Data: ic,
                IsSuccess: true,
            });
        } else {
            res.status(200).json({
                Message: "Invalid Data!",
                // Data: Customer,
                IsSuccess: false,
            });
        }
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/serviceProvider", async function(req, res, next) {
    
    let {
        companyId,
        inventoryId,
        serviceProviderName,
        serviceProviderDescription,
        appointmentMinutes,
        rateType,
        rateAmt,
        lat,
        long
    } = req.body;
    let {_id } = req.body;
    try {
        if (
            !companyId ||  !inventoryId || !serviceProviderName ||  !serviceProviderDescription ||  !appointmentMinutes ||  !rateType ||  !rateAmt   ) throw new Error('Invalid data passes!')
        let data = JSON.parse(JSON.stringify({companyId,
            inventoryId,
            serviceProviderName,
            serviceProviderDescription,
            appointmentMinutes,
            rateType,
            rateAmt, lat, long}));
        let id = _id || new config.mongoose.Types.ObjectId();

        let serviceP = await companyServicesProviderSchema.findOneAndUpdate({'_id': id}, data, {upsert: true, new : true});
        if (serviceP) {
            res.status(200).json({
                Message: "ServicesProvider updated",
                Data: serviceP,
                IsSuccess: true,
            });
        } else {
            res.status(200).json({
                Message: "Invalid Data!",
                // Data: Customer,
                IsSuccess: false,
            });
        }
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.put("/profile/:vendorId", async function (req, res, next) {
    const { vendorId } = req.params;
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
        registrationValidUpto,
    } = req.body;
    try {
        let company = await companyMasterSchema.findById({ _id: vendorId })
        company.doj = doj || company.doj;
        company.businessCategoryId = businessCategoryId || company.businessCategoryId;
        company.companyName = companyName || company.companyName;
        company.addressLine1 = addressLine1 || company.addressLine1;
        company.addressLine2 = addressLine2 || company.addressLine2;
        company.cityMasterId = cityMasterId || company.cityMasterId;
        company.zipcode = zipcode || company.zipcode;
        company.mapLocation = mapLocation || company.mapLocation;
        company.phone = phone || company.phone;
        company.fax = fax || company.fax;
        company.url = url || company.url;
        company.supportEmail = supportEmail || company.supportEmail;
        company.adminEmail = adminEmail || company.adminEmail;
        company.adminMobile = adminMobile || company.adminMobile;
        company.adminPassword = adminPassword || company.adminPassword;
        company.gstinNo = gstinNo || company.gstinNo;
        company.paNo = paNo || company.paNo;
        company.bankName = bankName || company.bank.bankName;
        company.bankBranchName = bankBranchName || company.bank.bankBranchName;
        company.bankAddress = bankAddress || company.bank.bankAddress;
        company.bankCity = bankCity || company.bank.bankCity;
        company.bankState = bankState || company.bank.bankState;
        company.bankAccountNo = bankAccountNo || company.bank.bankAccountNo;
        company.bankIfscCode = bankIfscCode || company.bank.bankIfscCode;
        company.companyType = companyType || company.companyType;
        company.personName = personName || company.personName;
        company.weekStartDay = weekStartDay || company.weekStartDay;
        company.cancellationPolicy = cancellationPolicy || company.cancellationPolicy;
        company.registrationValidUpto = registrationValidUpto || company.registrationValidUpto;
        await company.save()
        res.status(200).json({
            Message: "customer profile.",
            Data: company,
            IsSuccess: true,
        });
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: null, IsSuccess: false });
    }
});

module.exports = router;