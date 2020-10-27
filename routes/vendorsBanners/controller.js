const vendorsBanners = require('./model');
const { ObjectId } = require('mongodb');
const BannerMaster = require('../bannerMaster/model');
const _ = require('lodash')

exports.getAll = async (req, res, next) => {
    try {
        let {vendorId} = req.body;
        let banners = await vendorsBanners.find(JSON.parse(JSON.stringify({companyId: vendorId})))
            .populate('companyId', '_id companyName')
            .sort('-updatedAt')
        res.status(200).json({
            isSuccess: true,
            Data: banners,
            Message: "vendors banners List"
        })
    } catch (err) {
        res.status(500).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};

exports.getFilterData = async (req, res, next) => {
    let {bannerSize, packageType} = req.query;
    let banners = await BannerMaster.find(JSON.parse(JSON.stringify({bannerSize:bannerSize, packageType: packageType})))
    .populate()
    .sort('-updatedAt');
    let result = {};
    if (bannerSize && packageType) {
        result = banners[0]
    } else {
        result = {
            bannerSize : _.uniq(Object.keys(_.groupBy(banners, 'bannerSize'))),
            packageType : _.uniq(Object.keys(_.groupBy(banners, 'packageType'))),

        };
    }
res.status(200).json({
    isSuccess: true,
    Data: result,
    Message: "vendors banners filter data"
})
}
exports.create = async (req, res, next) => {
    try {
        let { _id, companyId, bannerSize, packageType, packageUnit, UnitType, startDate, endDate, bannerImage, bannerAttachment, url, payModalId, transactionNo, orderNo, billEmailed, emailDateTime, offerCount, isApproved, aprroveDate, 
        } = req.body;
        if (!companyId || !bannerSize || !packageType || !packageUnit || !UnitType || !startDate || !endDate || !bannerImage || !bannerAttachment || !url || !payModalId || !transactionNo || !orderNo) throw new Error('Invalide request data!')
        let banner = null;

        // let checkFilterCondition = {}
        // if (_id) {
        //     checkFilterCondition._id = { $ne: ObjectId(_id) }
        // }
        // checkFilterCondition['$or'] = [
        //     { 'name': name }
        // ];
        // let isExist = await OfferMaster.countDocuments(checkFilterCondition)
        // if (isExist) {
        //     throw new Error(`Offer name ${name} already Exist!`)
        // }
        if (_id) {
            banner = await vendorsBanners.findOne({ '_id': _id });
            companyId = companyId || banner.companyId;
            bannerSize = bannerSize || banner.bannerSize;
            packageType = packageType || banner.packageType;
            packageUnit = packageUnit || banner.packageUnit;
            UnitType = UnitType || banner.UnitType;
            startDate = startDate || banner.startDate;
            endDate = endDate || banner.endDate;
            bannerImage = bannerImage || banner.bannerImage;
            bannerAttachment = bannerAttachment || banner.bannerAttachment;
            url = url || banner.url;
            payModalId = payModalId || banner.payModalId;
            transactionNo = transactionNo || banner.transactionNo;
            orderNo = orderNo || banner.orderNo;
            billEmailed = billEmailed || banner.billEmailed;
            emailDateTime = emailDateTime || banner.emailDateTime;
            offerCount = offerCount || banner.offerCount;
            isApproved = isApproved || banner.isApproved;
            aprroveDate = aprroveDate || banner.aprroveDate;
        } else {
            banner = new vendorsBanners({
                companyId,
                bannerSize,
                packageType,
                packageUnit,
                UnitType,
                startDate,
                endDate,
                bannerImage,
                bannerAttachment,
                url,
                payModalId,
                transactionNo,
                orderNo,
                billEmailed,
                emailDateTime,
                offerCount,
                isApproved,
                aprroveDate,
            })
        }
        await banner.save();
        res.status(200).json({
            IsSuccess: true,
            Data: banner,
            Message: "Message"
        })
    } catch (err) {
        res.status(400).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};

exports.bannerApproved = async (req, res, next) => {
    try {
        let { _id, aprroveDate, isApproved } = req.body;
        if (!_id || !aprroveDate || isApproved == undefined) throw new Error('Invalide data vendors banners!')
        let banner = null;

        if (_id) {
            banner = await vendorsBanners.findOne({ '_id': _id });

            banner.aprroveDate = aprroveDate;
            banner.isApproved = isApproved

            await banner.save();
        } else {
            throw new Error('Invalid Request data!')
        }
        res.status(200).json({
            IsSuccess: true,
            Data: banner,
            Message: "Message"
        })
    } catch (err) {
        res.status(400).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};

exports.removeItem = async (req, res, next) => {
    try {
        let { bannerId } = req.params;
        let { allowDelete } = req.body;
        if (!bannerId) throw new Error('Invalide data supplide!')

        let banner = await vendorsBanners.findByIdAndRemove(bannerId);
        res.status(200).json({
            IsSuccess: true,
            Data: banner,
            Message: "Message"
        })
    } catch (err) {
        res.status(400).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};