const OfferMaster = require('./model');
const { ObjectId } = require('mongodb');

exports.getAll = async (req, res, next) => {
    try {
        let states = await OfferMaster.find()
            .populate('companyId', '_id companyName')
            .sort('-updatedAt')
        res.status(200).json({
            isSuccess: true,
            Data: states,
            Message: "Offers List"
        })
    } catch (err) {
        res.status(500).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};

exports.create = async (req, res, next) => {
    try {
        let { _id, companyId, name, startDate, endDate, offerCount, offerTerms, attachment, image } = req.body;
        if (!companyId || !name || !startDate || !endDate || !offerCount || !offerTerms || !attachment || !image) throw new Error('Invalide data Offers!')
        let offer = null;

        let checkFilterCondition = {}
        if (_id) {
            checkFilterCondition._id = { $ne: ObjectId(_id) }
        }
        checkFilterCondition['$or'] = [
            { 'name': name }
        ];
        let isExist = await OfferMaster.countDocuments(checkFilterCondition)
        if (isExist) {
            throw new Error(`Offer name ${name} already Exist!`)
        }
        if (_id) {
            offer = await OfferMaster.findOne({ '_id': _id });
            offer.companyId = companyId || offer.companyId;
            offer.name = name || offer.name;
            offer.startDate = startDate || offer.startDate;
            offer.endDate = endDate || offer.endDate;
            offer.offerCount = parseInt(offerCount) || offer.offerCount;
            offer.offerTerms = offerTerms || offer.offerTerms;
            offer.attachment = attachment || offer.attachment;
            offer.image = image || offer.image;
        } else {
            offer = new OfferMaster({
                companyId, name, startDate, endDate, offerCount, offerTerms, attachment, image
            })
        }
        await offer.save();
        res.status(200).json({
            IsSuccess: true,
            Data: offer,
            Message: "Message"
        })
    } catch (err) {
        res.status(400).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};

exports.offerApproved = async (req, res, next) => {
    try {
        let { _id, aprroveDate, isApproved } = req.body;
        if (!_id || !aprroveDate || isApproved == undefined) throw new Error('Invalide data Offers!')
        let offer = null;

        if (_id) {
            offer = await OfferMaster.findOne({ '_id': _id });

            offer.aprroveDate = aprroveDate;
            offer.isApproved = isApproved

            await offer.save();
        } else {
            throw new Error('Invalid Request data!')
        }
        res.status(200).json({
            IsSuccess: true,
            Data: offer,
            Message: "Message"
        })
    } catch (err) {
        res.status(400).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};

exports.removeItem = async (req, res, next) => {
    try {
        let { offerId } = req.params;
        let { allowDelete } = req.body;
        if (!offerId) throw new Error('Invalide data supplide!')

        let offer = await OfferMaster.findByIdAndRemove(offerId);
        res.status(200).json({
            IsSuccess: true,
            Data: offer,
            Message: "Message"
        })
    } catch (err) {
        res.status(400).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};