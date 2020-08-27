var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");
var config = require('../config');
var dateFormat = require('dateformat');
// const bcrypt = require('bcrypt');
var customerMasterSchema = require('../model/customermaster');
var companyInventoryMasterSchema = require('../model/companyinventorymaster');
var companyServicesProviderSchema = require('../model/companyservicesprovider');
var stateMasterSchema = require('../model/statemaster');
var cityMasterSchema = require('../model/citymaster');
var categoryMasterSchema = require('../model/categorymaster');
var companyMasterSchema = require('../model/companymaster');
var termnconditionSchema = require('../model/termncondition');
var bannerSchema = require('../model/banner');
var bookingSlotMasterSchema = require('../model/bookingslotmaster');
var bookingMasterSchema = require('../model/booking');
var companyTransactionSchema = require('../model/companytransaction');
var feedbackSchema = require('../model/feedback');

var customerlocation = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/customer");
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});
var uploadcustomer = multer({ storage: customerlocation });

/* APIS listing. */
router.post('/customerSignUp', async function(req, res, next) {
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

router.post("/customerSignIn", async function(req, res, next) {
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

router.post("/getcustomerById", async function(req, res, next) {
    const { id } = req.body;
    try {
        let data = await customerMasterSchema.find({ _id: id });
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

router.post('/getBanner', async function(req, res, next) {
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

router.post('/getState', async function(req, res, next) {
    try {
        let data = await stateMasterSchema.find();
        res.status(200).json({
            Message: "State Data!",
            Data: data,
            IsSuccess: true
        });

    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/getCity', async function(req, res, next) {
    try {
        let data = await cityMasterSchema.find({ stateId: req.body.stateId });
        res.status(200).json({
            Message: "City Data!",
            Data: data,
            IsSuccess: true
        });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/updateCustomer', uploadcustomer.single("image"), async function(req, res, next) {
    const { id, firstName, lastName, mobileNo, emailID, password, address1, address2, city, state, zipcode } = req.body;
    try {
        const file = req.file;
        if (file == undefined) {
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
        } else {
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
                image: file.path
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

router.post('/getTermNCondition', async function(req, res, next) {
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

router.post('/getCategoryMaster', async function(req, res, next) {
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

router.post('/getCompanyMasterByBusinessCategoryId', async function(req, res, next) {
    try {
        const { businessCategoryId } = req.body;
        let data = await companyMasterSchema.find({ businessCategoryId: businessCategoryId }).populate('businessCategoryId', ' businessCategoryName').populate('cityMasterId');
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

router.post("/getServiceListByCompanyId", async function(
    req,
    res,
    next
) {
    try {
        const { companyId } = req.body;
        serviceProviders = await companyServicesProviderSchema.find({
            companyId: companyId,
        });
        res
            .status(200)
            .json({ Message: "Data Found!", Data: serviceProviders, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/updateCustomerPassword', async function(req, res, next) {
    const { emailID, password } = req.body;
    try {
        let data = await customerMasterSchema.find({ emailID: emailID });
        if (data.length == 1) {
            var dataa = {
                password: password
            };
            let datas = await customerMasterSchema.findOneAndUpdate({ emailID: emailID }, dataa);
        }
        res
            .status(200)
            .json({ Message: "PASSWORD CHANGED S Updated!", Data: data, IsSuccess: true });
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post('/addBookingMaster', async function(req, res, next) {
    const {
        customerId,
        bookingDate,
        orderNo,
        companyId,
        inventoryId,
        serviceProviderId,
        bookingSlotId,
        appointmentDate,
        appointmentTime,
        bookingForName,
        mobileNo,
        specialRequest,
        sendMeReminderMail,
        amount,
        serviceCharge,
        totalAmt,
        taxableValue,
        cgstAmt,
        sgstAmt,
        igstAmt,
        payThrough,
        payDateTime,
        transactionNo,
        billNo,
        billEmailed,
        emailDateTime,
        geoLocationArrival,
        noShowTime,
        customerReached,
        serviceStartedTime,
        serviceCompletedTime,
        amtCollectedFromCustomer,
        customerFeeback,
        customerRating
    } = req.body;
    try {
        var bookingMaster = new bookingMasterSchema({
            _id: new config.mongoose.Types.ObjectId,
            customerId: customerId,
            bookingDate: bookingDate,
            orderNo: orderNo,
            companyId: companyId,
            inventoryId: inventoryId,
            serviceProviderId: serviceProviderId,
            bookingSlotId: bookingSlotId,
            appointmentDate: appointmentDate,
            appointmentTime: appointmentTime,
            bookingForName: bookingForName,
            mobileNo: mobileNo,
            specialRequest: specialRequest,
            sendMeReminderMail: sendMeReminderMail,
            amount: amount,
            serviceCharge: serviceCharge,
            totalAmt: totalAmt,
            taxableValue: taxableValue,
            cgstAmt: cgstAmt,
            sgstAmt: sgstAmt,
            igstAmt: igstAmt,
            payThrough: payThrough,
            payDateTime: payDateTime,
            transactionNo: transactionNo,
            billNo: billNo,
            billEmailed: billEmailed,
            emailDateTime: emailDateTime,
            geoLocationArrival: geoLocationArrival,
            noShowTime: noShowTime,
            customerReached: customerReached,
            serviceStartedTime: serviceStartedTime,
            serviceCompletedTime: serviceCompletedTime,
            amtCollectedFromCustomer: amtCollectedFromCustomer,
            customerFeeback: customerFeeback,
            customerRating: customerRating
        });
        var datas = await bookingMaster.save();
        if (datas) {
            res
                .status(200)
                .json({ Message: "Booking Master Added!", Data: 1, IsSuccess: true });
        } else {
            res
                .status(200)
                .json({ Message: "Booking Master Not Added!", Data: 0, IsSuccess: true });
        }

    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/addCompanyTransaction', async function(req, res, next) {
    const {
        companyId,
        inventoryId,
        transactionType,
        transactionDate,
        transactionMode,
        drAmt,
        crAmt,
        remark,
        entryTime,
        entryBy
    } = req.body;
    try {
        var companyTransaction = new companyTransactionSchema({
            _id: new config.mongoose.Types.ObjectId,
            companyId: companyId,
            inventoryId: inventoryId,
            transactionType: transactionType,
            transactionDate: transactionDate,
            transactionMode: transactionMode,
            drAmt: drAmt,
            crAmt: crAmt,
            remark: remark,
            entryTime: entryTime,
            entryBy: entryBy
        });
        var datas = await companyTransaction.save();
        if (datas) {
            res
                .status(200)
                .json({ Message: "Company Transaction Save!", Data: req.body, IsSuccess: true });
        } else {
            res
                .status(200)
                .json({ Message: "Company Transaction Not Save!", Data: 0, IsSuccess: true });
        }

    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/getBookingHistoryByCustomerID', async function(req, res, next) {
    try {
        const { customerId } = req.body;
        let data = await bookingMasterSchema.find({ status: "pending", customerId: customerId }).populate('companyId').populate('inventoryId').populate('serviceProviderId').populate('customerId');
        let datalist = [];
        var Complete = []; {
            Complete = await bookingMasterSchema.find({ status: "complete", customerId: customerId }).populate('companyId').populate('inventoryId').populate('serviceProviderId').populate('customerId');
        }
        var Cancelled = []; {
            Cancelled = await bookingMasterSchema.find({ status: "cancelled", customerId: customerId }).populate('companyId').populate('inventoryId').populate('serviceProviderId').populate('customerId');
        }
        var datas = await datalist.push({ Pending: data, Complete: Complete, Cancelled: Cancelled });
        if (datas != "null") {
            res
                .status(200)
                .json({ Message: "Data Found!", Data: datalist, IsSuccess: true });
        } else {
            res
                .status(200)
                .json({ Message: "Something Went Wrong ", Data: datalist, IsSuccess: true });
        }
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/getUpcomingByCustomerID', async function(req, res, next) {
    try {
        var today = new Date();
        const { customerId } = req.body;
        var today = new Date();
        let data = await bookingMasterSchema.find({ customerId: customerId, status: "pending", bookingDate: { $gte: today } });
        if (data != "null") {
            res
                .status(200)
                .json({ Message: "Data Found!", Data: data, IsSuccess: true });
        } else {
            res
                .status(200)
                .json({ Message: "Something Went Wrong ", Data: datalist, IsSuccess: true });
        }
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/updateBookingCancel', async function(req, res, next) {
    const { bookingId, orderNo, status } = req.body;
    try {
        let data = await bookingMasterSchema.find({ _id: bookingId, orderNo: orderNo });
        if (data.length == 1) {
            var dataa = {
                status: status
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

router.post('/addFeedback', async function(req, res, next) {
    const { customerId, message } = req.body;
    try {
        var feedback = new termnconditionSchema({
            _id: new config.mongoose.Types.ObjectId,
            customerId: customerId,
            message: message
        });
        feedback.save();
        res
            .status(200)
            .json({ Message: "Feedback Added!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post('/updateFCMTokenById', async function(req, res, next) {
    const { id, fcmToken } = req.body;
    try {
        let data = await customerMasterSchema.find({ _id: id });
        if (data.length == 1) {
            var dataa = {
                fcmToken: fcmToken
            };
            let datas = await customerMasterSchema.findByIdAndUpdate(id, dataa);
        }
        res
            .status(200)
            .json({ Message: "FCMToken Updated!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post('/updateFeedbackByOrderNo', async function(req, res, next) {
    const { orderNo, customerFeeback, customerRating } = req.body;
    try {
        let data = await bookingMasterSchema.find({ orderNo: orderNo });
        if (data.length == 1) {
            var dataa = {
                customerFeeback: customerFeeback,
                customerRating: customerRating
            };
            let datas = await bookingMasterSchema.findOneAndUpdate({ orderNo: orderNo }, dataa);
        }
        res
            .status(200)
            .json({ Message: "Feedback Updated!", Data: 1, IsSuccess: true });
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post('/getbillDetailByOrderNo', async function(req, res, next) {
    const { orderNo } = req.body;
    try {
        let data = await bookingMasterSchema.find({ orderNo: orderNo });
        if (data.length == 1) {
            res
                .status(200)
                .json({ Message: "Bill Detail !", Data: data, IsSuccess: true });
        } else {
            res
                .status(200)
                .json({ Message: "Error!", Data: 0, IsSuccess: true });
        }

    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});

router.post("/avaliableSlot", async function(req, res, next) {
    const { inventoryId, serviceProviderId } = req.body;
    try {
        let datalist = [];
        data = await companyInventoryMasterSchema.find({ _id: inventoryId });
        if (data.length > 0 && data[0].multipleServiceProviderRequired == true) {
            let data = await bookingMasterSchema.find({ serviceProviderId: serviceProviderId, appointmentDate: new Date().toISOString() }).populate("companyId").populate("inventoryId").populate("serviceProviderId")
                .populate("customerId");

            for (let i = 0; i < data.length; i++) {
                var bookingSlotId = data[i].bookingSlotId;
                var appointmentDate = data[i].appointmentDate;
                var appointmentTime = data[i].appointmentTime;
                datalist.push({ bookingSlotId: bookingSlotId, appointmentDate: appointmentDate, appointmentTime: appointmentTime });
            }
        } else {
            let data = await bookingMasterSchema.find({ inventoryId: inventoryId, appointmentDate: new Date().toISOString() }).populate("companyId").populate("inventoryId").populate("serviceProviderId")
                .populate("customerId");
            for (let i = 0; i < data.length; i++) {
                var bookingSlotId = data[i].bookingSlotId;
                var appointmentDate = data[i].appointmentDate;
                var appointmentTime = data[i].appointmentTime;
                datalist.push({ bookingSlotId: bookingSlotId, appointmentDate: appointmentDate, appointmentTime: appointmentTime });
            }
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
    } catch (err) {
        res.json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});


module.exports = router;