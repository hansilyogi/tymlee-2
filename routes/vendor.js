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
const { ObjectId } = require('mongodb');
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

router.get("/getInventories/:vendorId", async function(req, res, next) {
    const { vendorId } = req.params;
    try {
        if (!vendorId) throw new Error('Invalid vendor.')
        let companyUser = await companyInventoryMaster.findOne({companyId: vendorId.toString()});
        if (companyUser) {
            res.status(200).json({
                Message: "New Password set successfully",
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
                personPhoto: req.files !== undefined ? (req.files.personPhoto == undefined ?
                    null : req.files.personPhoto[0].path) : null,
                aadharCard: req.files !== undefined ? (req.files.aadharCard == undefined ?
                    null : req.files.aadharCard[0].path) : null,
                panCard: req.files !== undefined ? (req.files.panCard == undefined ? null : req.files.panCard[0].path) : null,
                cancelledCheque: req.files !== undefined ? (req.files.cancelledCheque == undefined ?
                    null : req.files.cancelledCheque[0].path) : null,
                weekStartDay: weekStartDay,
                companyLogo: req.files !== undefined ? (req.files.companyLogo == undefined ?
                    null : req.files.companyLogo[0].path) : null,
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

router.post("/getAllCustomer", async function(req, res, next) {
    try {
        let customer = await bookingMasterSchema.find({ companyId: req.body.companyId }).distinct('customerId');
        let customerData = await customerMasterSchema.find({ _id: { $in: customer } });
        let data = [];
        for (let obj of customerData) {
            let appointments = await bookingMasterSchema.find({ companyId: req.body.companyId, customerId: obj._id }).populate('customerId').populate('inventoryId').populate('serviceProviderId').populate('bookingSlotId');
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
        let data = await bookingMasterSchema.find({
            companyId: req.body.companyId,
            appointmentDate: {
                $lt: new Date(),
                $gte: new Date(new Date().setDate(new Date().getDate() - 1))
            }
        }).populate('customerId').populate('inventoryId').populate('serviceProviderId').populate('bookingSlotId');
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
        let {companyId, bookingDate} = req.body;
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
        }
        let condition = JSON.parse(JSON.stringify({companyId, bookingDate}));
        condition.status = {$ne: 'cancel'}
        let data = await bookingMasterSchema.find(condition)
        .select('_id status customerId inventoryId serviceProviderId bookingSlotId appointmentDate appointmentTime mobileNo specialRequest totalAmt taxableValue cgstAmt sgstAmt igstAmt payDateTime transactionNo billNo')
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
        .select('_id status customerId inventoryId serviceProviderId bookingSlotId appointmentDate appointmentTime mobileNo specialRequest totalAmt taxableValue cgstAmt sgstAmt igstAmt payDateTime transactionNo billNo')
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
        let {companyId, customerId, _id, status} = req.body;
        if (!status || !_id) {
            throw new Error('Invalid data Passed, Customer, Company And Status are required!')
        }
        let booking = await bookingMasterSchema.findOne({_id});
        if (booking) {
            booking.status = status;
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

module.exports = router;