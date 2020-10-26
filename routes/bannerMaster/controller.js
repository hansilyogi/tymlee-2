const bannerMaster = require('./model');
const { ObjectId } = require('mongodb');

exports.getAll = async (req, res, next) => {
    try {
        let states = await bannerMaster.find()
            .sort('-updatedAt')
        res.status(200).json({
            isSuccess: true,
            Data: states,
            Message: "Banner Master List"
        })
    } catch (err) {
        res.status(500).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};

exports.create = async (req, res, next) => {
    try {
        let { _id,bannerSize,
            packageType,
            weekPrice,
            monthPrice } = req.body;
        if (!bannerSize || !packageType || !weekPrice || !monthPrice ) throw new Error('Invalide request data!')
        let banner = null;

        let checkFilterCondition = {}
        if (_id) {
            checkFilterCondition._id = { $ne: ObjectId(_id) }
        }
        if (bannerSize) {
            checkFilterCondition.bannerSize = bannerSize
        }

        if (packageType) {
            checkFilterCondition.packageType = packageType
        }

        let isExist = await bannerMaster.countDocuments(checkFilterCondition)
        if (isExist) {
            throw new Error(`Banner already Exist!`)
        }
        if (_id) {
            banner = await bannerMaster.findOne({ '_id': _id });
            banner.bannerSize = bannerSize || banner.bannerSize; 
            banner.packageType = packageType || banner.packageType; 
            banner.weekPrice = parseInt(weekPrice) || parseInt(banner.weekPrice); 
            banner.monthPrice = parseInt(monthPrice) || parseInt(banner.monthPrice);
        } else {
            banner = new bannerMaster({
                bannerSize, packageType, weekPrice, monthPrice
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


exports.removeItem = async (req, res, next) => {
    try {
        let { bannerId } = req.params;
        let { allowDelete } = req.body;
        if (!bannerId) throw new Error('Invalide data supplide!')
        // if banner exist in child don't remove
        let banner = await bannerMaster.findByIdAndRemove(bannerId);
        res.status(200).json({
            IsSuccess: true,
            Data: banner,
            Message: "Message"
        })
    } catch (err) {
        res.status(400).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};