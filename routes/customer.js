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
var cityBusinessCategorySchema = require('../model/citybusinesscategory');
var companyMasterSchema = require('../model/companymaster');
var termnconditionSchema = require('../model/termncondition');
var bannerSchema = require('../model/banner');
var bookingSlotMasterSchema = require('../model/bookingslotmaster');
var bookingMasterSchema = require('../model/booking');
var companyTransactionSchema = require('../model/companytransaction');
var feedbackSchema = require('../model/feedback');
const { ObjectId } = require('mongodb');
const moment = require('moment');
var _ = require('lodash');
const razorPay = require('./razorPay/controller');
const {appConfig} = require('../app_config');
const commonController = require('./common');
const { request } = require('http');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    apiKey: appConfig.gKey, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };
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

var _uploader = multer({
    dest: path.join(appConfig.root, 'tmp'),
    // maxCount: config.uploads.maxCount,
    // limits: { // 1GB
    //   fieldSize: 1048576000,
    //   fileSize: 1048576000
    // }
  });
var _mwUpload = _uploader.array('upload', 10);

/* APIS listing. */

router.get("/profile/:userId", async function(req, res, next) {
    const { userId } = req.params;
    try {
        let user = await customerMasterSchema.findById({_id: userId}).select('_id isActive firstName lastName mobileNo emailID password address1 address2 city state zipcode isVerified image').populate('image');
                res.status(200).json({
                    Message: "customer profile.",
                    Data: user,
                    IsSuccess: true,
                });
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: null, IsSuccess: false });
    }
});
router.get('/completeBooking/:customerId', async function(req, res, next) {
    try {
        const { customerId } = req.params;
        if (!customerId) {throw new Error('Invalid Customer !')}
        let data = await bookingMasterSchema.find({ 
            customerId: ObjectId(customerId), 
            $or: [ { status:  "Completed"}]
        })
        .populate('companyId', '_id companyName personName personPhoto companyLogo addressLine1 addressLine2')
        .populate('serviceProviderId', '_id serviceProviderName serviceProviderDescription')
        .populate('bookingSlotId', '_id dayName slotName fromTime toTime rate')
        .sort({ 'bookingDate': -1 });
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
router.get('/getImage/:uploadId', commonController.download)
router.get('/cutomers', async function(req, res, next) {
    try {

    } catch(err) {
        res.status(400).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
})
router.get('/search-serviceprovider/:categoryId/:search', async function(req, res, next) {
    try {
        let {categoryId, search} = req.params;
        if (!categoryId || !search) { throw new Error('Invalid Service provider request')}
        let companies = await companyMasterSchema.find({businessCategoryId: ObjectId(categoryId)}).select('_id');
        let companyIds = [];
        if (companies &&  companies.length) {
            companies.map((item, i) => {
                console.log(i)
                if (item._id) { 
                    companyIds.push(item._id)
                }
            })  
            console.log('map done')
            let serviceP = await companyServicesProviderSchema.find({
                companyId: {$in: companyIds},
                serviceProviderName: new RegExp(search.toLowerCase(), "i")});
            return res.status(200).json({
                IsSuccess: true,
                Data: serviceP
            })
        }
        res.status(200).json({
            IsSuccess: true,
            Data: []
        })
    } catch(err) {
        res.status(400).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
})
router.post('/customerSignUp', async function(req, res, next) {
    let { firstName, lastName, mobileNo, emailID, password, address1, address2, city, state, zipcode, gender } = req.body;
    try {
        let existCustomer = await customerMasterSchema.find({ $or: [{mobileNo: mobileNo, emailID: emailID}] });
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
                emailID: (emailID).toLowerCase(),
                password: password,
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                zipcode: zipcode,
                isActive: true,
                isVerified: true,
                gender: gender
            });
            await newCustomer.save();
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
        let Customer = await customerMasterSchema.findOne({
            emailID: emailID.toLowerCase(),
            password: password,
            isVerified: true,
            isActive: true,
        }).select('firstName lastName mobileNo emailID address1 address2 city state zipcode image password gender').populate('image');
        if (Customer) {
            res.status(200).json({
                Message: "Customer  Login!",
                Data: Customer,
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

router.post("/changePassword", async function(req, res, next) {
    const { emailID, _id, password,confirmPassword } = req.body;
    try {
        if (!_id) throw new Error('Invalid customer provided.')
        let Customer = await customerMasterSchema.findOne(JSON.parse(JSON.stringify({_id})));
        if (Customer) {
            Customer.password = password;
            await Customer.save();
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

router.post("/getcustomerById", async function(req, res, next) {
    const { id } = req.body;
    try {
        let data = await customerMasterSchema.find({ _id: id });
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

router.post('/getState', async function (req, res, next) {
    try {
        let data = await stateMasterSchema.find().lean();
        if (data && data.length) {
            let promise = data.map(async stateObj => {
                let response = await cityMasterSchema.find({
                    stateId: stateObj._id
                });
                return { ...stateObj, cities: response };
            });
            const results = await Promise.all(promise);
            res.status(200).json({
                Message: "State Data!",
                Data: results,
                IsSuccess: true
            });
        } else {
            res.status(200).json({
                Message: "State Data!",
                Data: data || [],
                IsSuccess: true
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

router.post('/getCity', async function(req, res, next) {
    try {
        let {stateId} = req.body;
        let filter = {
            status: true
        }
        if (stateId) {
            filter.stateId = ObjectId(stateId)
        }
        let data = await cityMasterSchema.find(JSON.parse(JSON.stringify(filter)));
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

router.post('/getCityByLatLang',async function(req, res, next) {
    try {
        let {lat, lon} = req.body;
        if (!lat || !lon) throw new Error ("Invalid lat lang values")
        const geocoder = NodeGeocoder(options)
        let d = await geocoder.reverse({ lat, lon });
        let cityNames = [];
        if (d && d.length) {
            d.forEach(element => {
                cityNames.push((element.city))  
            });
            let cityData = await cityMasterSchema.find({status: true, cityName: {$in: cityNames}}).lean(); //{cityName: {$in: cityNames}}
            if (cityData && cityData.length) {
                let data = cityData ;
                // cityData.map((item) => {
                //     let isServiceExist = false
                //     if (cityNames.indexOf((item.cityName).toLowerCase()) >= 0) {
                //         isServiceExist = true;
                //     }
                //     data.push({...item, isServiceExist})
                // })
                return res.status(200).json({
                    "IsSuccess": true,
                    "Message": "City Data!",
                    "isServiceExist": false,
                    Data: data
                })
            } else {
                cityData = await cityMasterSchema.find({status: true}).lean();
                return res.status(200).json({
                    "IsSuccess": true,
                    "isServiceExist": false,
                    "Message": "City Data!",
                    Data: cityData
                })
            }
        }
        res.status(200).json({
           d
        })    
    } 
    catch(err) {
        res.status(400).json({
            err
        })     
    }
});
router.post('/updateCustomer', async function(req, res, next) {
    const { id, firstName, lastName, mobileNo, emailID, password, address1, address2, city, state, zipcode, gender, image, imageAttachment } = req.body;
    try {
       
            var data = JSON.parse(JSON.stringify({
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
                gender: gender,
                image: image || undefined,
                imageAttachment: imageAttachment || undefined
            })) ;
        
            // var data = ({
            //     firstName: firstName,
            //     lastName: lastName,
            //     mobileNo: mobileNo,
            //     emailID: emailID,
            //     password: password,
            //     address1: address1,
            //     address2: address2,
            //     city: city,
            //     state: state,
            //     zipcode: zipcode,
            //     image: image
            // });
        
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

router.post('/getCategoryByCity', async function (req, res, next) {
    try {
        const { cityId } = req.body;
        if (!cityId) {
            return res.json({
                Message: 'Invalid city provided!',
                IsdSuccess: false,
            })
        }
        
        let data = await companyMasterSchema.find({ cityMasterId: cityId, active: true })
            // .select('_id active')
            .populate({
                path: 'businessCategoryId'
            }).lean();
        let companyCategory = [];
        let companyCategoryIds = [];
        if (data && data.length) {
            data.forEach(element => {
                companyCategoryIds.push(element.businessCategoryId);
                if (element.businessCategoryId) {
                    if (element.cityMasterId == cityId) {
                        companyCategory.push({...element.businessCategoryId, companyId: element._id, availability: true});
                    } else {
                        companyCategory.push({...element.businessCategoryId, companyId: element._id, availability: false});
                    }
                }
            });
        }
        let allCategory = await categoryMasterSchema.find({
            _id: {$nin: companyCategoryIds}
        }).lean();
        if (allCategory && allCategory.length) {
            allCategory.map(item => {
                item.availability = false;
                return item;
            })
        }
        companyCategory = companyCategory.concat(allCategory)
        res
            .status(200)
            .json({ Message: "Catergory Master Data!", Data: _.uniqBy(companyCategory, '_id'), IsSuccess: true });
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
        const { businessCategoryId, cityMasterId } = req.body;
        let conditions = JSON.parse(JSON.stringify({businessCategoryId, cityMasterId, active: true,}));
        let data = await companyMasterSchema.find(conditions)
            .populate('businessCategoryId', ' businessCategoryName')
            .populate('cityMasterId');
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
        let filter = JSON.parse(JSON.stringify({companyId: companyId}))
        filter.serviceProviderAvailable = true;
        serviceProviders = await companyServicesProviderSchema.find(filter)
        .populate('companyId', '_id personName personPhoto companyName companyType active gstinNo addressLine1 addressLine2 cityMasterId companyCode mapLocation companyHtmlPage adminMobile businessCategoryId cancellationPolicy companyLogo phone weekStartDay zipcode')
        .populate('inventoryId');
        res.status(200)
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
            payDateTime: payDateTime || new Date(),
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
        const { customerId } = req.body;
        var today = new Date();
        let data = await bookingMasterSchema.find({ 
            customerId: customerId, 
            $or: [ { status:  "pending"}, { status: "confirm" } ],
            bookingDate: { $gte: moment().startOf('day').format() } 
        })
        .populate('companyId', '_id companyName personName personPhoto companyLogo addressLine1 addressLine2 mapLocation phone')
        .populate('serviceProviderId', '_id serviceProviderName serviceProviderDescription')
        .populate('bookingSlotId', '_id dayName slotName fromTime toTime rate')
        .sort({ 'bookingDate': -1 });
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
        if (!bookingId || !orderNo) throw new Error('Invalid BookingId and Order number')
        let data = await bookingMasterSchema.find({ _id: bookingId, orderNo: orderNo });
        if (data.length == 1) {
            var dataa = {
                status: 'Cancel'
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
function getHrsToMinutes(date) {
    let t = moment(date).format()
    let hh = parseInt(moment(date).format('HH'));
    let mm = parseInt(moment(date).format('mm'));
    return ((hh)*60) + mm;
}
router.post("/avaliableSlot", async function (req, res, next) {
    const { inventoryId, serviceProviderId, date } = req.body;
    try {
        if (!inventoryId || !serviceProviderId || !date) {
            throw new Error('Invalid data, provide Inventory, ServiceProvider, Date');
        }
        const currentMinutes = getHrsToMinutes(date);
        let avaliableSlot = await bookingSlotMasterSchema.find({
            inventoryId: ObjectId(inventoryId),
            serviceProviderId: ObjectId(serviceProviderId),
            dayName: moment(date).format('dddd')
        }).lean();
        if (avaliableSlot && avaliableSlot.length) {
            let currentBooking = avaliableSlot.map(async (avaliableSlotObj, i) => {
                let sFrom = `${moment().format('YYYY-MM-DD')} ${avaliableSlotObj.fromTime}`;
                let sTo = `${moment().format('YYYY-MM-DD')} ${avaliableSlotObj.toTime}`;

                let convertFrom = getHrsToMinutes(sFrom);
                if (convertFrom >= currentMinutes) {
                    let bookinkgMaster = await bookingMasterSchema.countDocuments({
                        "bookingSlotId": avaliableSlotObj._id
                    });
                    avaliableSlotObj.remaingSlotCount = avaliableSlotObj.appointmentCount - bookinkgMaster
                    return avaliableSlotObj
                }
            })
            let result = await Promise.all(currentBooking);
                result  = result.filter((el) => el != null );
            return res.status(200).json({
                Message: "Data Found!", Data: result || [], IsSuccess: true
            })
        }
        return res.status(200).json({
            Message: "Data Found!", Data: avaliableSlot || [], IsSuccess: true
        })
        // data = await companyInventoryMasterSchema.find({ _id: inventoryId });
        // if (data.length > 0 && data[0].multipleServiceProviderRequired == true) {
        //     let data = await bookingMasterSchema.find({ serviceProviderId: serviceProviderId, appointmentDate: new Date().toISOString() }).populate("companyId").populate("inventoryId").populate("serviceProviderId")
        //         .populate("customerId");

        //     for (let i = 0; i < data.length; i++) {
        //         var bookingSlotId = data[i].bookingSlotId;
        //         var appointmentDate = data[i].appointmentDate;
        //         var appointmentTime = data[i].appointmentTime;
        //         datalist.push({ bookingSlotId: bookingSlotId, appointmentDate: appointmentDate, appointmentTime: appointmentTime });
        //     }
        // } else {
        //     let data = await bookingMasterSchema.find({ inventoryId: inventoryId, appointmentDate: new Date().toISOString() }).populate("companyId").populate("inventoryId").populate("serviceProviderId")
        //         .populate("customerId");
        //     for (let i = 0; i < data.length; i++) {
        //         var bookingSlotId = data[i].bookingSlotId;
        //         var appointmentDate = data[i].appointmentDate;
        //         var appointmentTime = data[i].appointmentTime;
        //         datalist.push({ bookingSlotId: bookingSlotId, appointmentDate: appointmentDate, appointmentTime: appointmentTime });
        //     }
        // }
        // if (datalist != "null") {
        //     res
        //         .status(200)
        //         .json({ Message: "Data Found!", Data: datalist, IsSuccess: true });
        // } else {
        //     res
        //         .status(200)
        //         .json({ Message: "Something Went Wrong ", Data: 0, IsSuccess: true });
        // }
    } catch (err) {
        res.status(400).json({
            Message: err.message,
            Data: 0,
            IsdSuccess: false,
        });
    }
});

router.post("/getCategoriesInfo", async function(req, res, next) {
    try {
        let banner = await bannerSchema.find();
        let categories = await categoryMasterSchema.find().lean();
        let results = [];
        if (categories && categories.length) {
            let promise = categories.map(async category => {
                let companies = await companyMasterSchema.find({ businessCategoryId: category._id, active: true, }).populate('businessCategoryId', ' businessCategoryName').populate('cityMasterId').lean();
                if (companies && companies.length) {
                    let innerPromise = companies.map(async company => {
                        let services = await companyServicesProviderSchema.find({
                            companyId: company._id,
                        });
                        return { ...company, services };
                    });
                    let innerResults = await Promise.all(innerPromise);
                    return { ...category, componies: innerResults };
                } else {
                    return { ...category, componies: [] };
                }
            });
            results = await Promise.all(promise);
        }
        res.status(200).json({ 
            Message: "Data Found!", 
            Data: {
                banner,
                categories: results
            }, 
            IsSuccess: true
        });
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: 0, IsSuccess: false });
    }
});
router.post('/new-order', razorPay.generateOrderNo)
router.post('/uploader', _mwUpload, commonController.s3Create)
router.post('/send-otp', commonController.sendOTP)
router.post('/verify-otp', commonController.verifyOTP)
router.put("/profile/:userId", async function(req, res, next) {
    const { userId } = req.params;
    let {firstName, lastName, mobileNo, emailID, password, address1, address2, city, state, zipcode} = req.body;
    try {
        let user = await customerMasterSchema.findById({_id: userId})
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.mobileNo = mobileNo || user.mobileNo;
        user.emailID = emailID || user.emailID;
        // user.password = password || user.password;
        user.address1 = address1 || user.address1;
        user.address2 = address2 || user.address2;
        user.city = city || user.city;
        user.state = state || user.state;
        user.zipcode = zipcode || user.zipcode;
        await user.save()
                res.status(200).json({
                    Message: "customer profile.",
                    Data: user,
                    IsSuccess: true,
                });
    } catch (err) {
        res.status(500).json({ Message: err.message, Data: null, IsSuccess: false });
    }
});

module.exports = router;