const StateMaster = require('../../model/statemaster');
const { ObjectId } = require('mongodb');
const citymaster = require('../../model/citymaster');
exports.getAll = async (req, res, next) => {
    try {
        let states = await StateMaster.find().sort('stateName')
        res.status(200).json({
            IsSuccess: true,
            Data: states,
            Message: "Message"
        })
    } catch (err) {
        res.status(500).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};

exports.create = async (req, res, next) => {
    try {
        let { _id, stateCode, stateName } = req.body;
        if (!stateName || !stateCode) throw new Error('Invalide data supplide!')
        let state = null;

        let checkFilterCondition = { }
        if (_id) {
            checkFilterCondition._id = {$ne: ObjectId(_id)}
        }
        checkFilterCondition['$or']  = [
                {'stateCode': stateCode}, 
                {'stateName': stateName}
        ];
        let isExist = await StateMaster.countDocuments(checkFilterCondition)
        if(isExist) {
            throw new Error(`State ${stateName} or ${stateCode} must be uniq!`)
        }
        if (_id) {
            state = await StateMaster.findOneAndUpdate({ '_id': _id }, { stateCode, stateName }, { new: true });
        } else {
            state = new StateMaster({
                stateCode, stateName
            })
            await state.save();
        }
        res.status(200).json({
            IsSuccess: true,
            Data: state,
            Message: "Message"
        })
    } catch (err) {
        res.status(400).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};

exports.removeItem = async (req, res, next) => {
    try {
        let { stateId } = req.params;
        let {allowDelete} = req.body;
        if (!stateId) throw new Error('Invalide data supplide!')
        let cities = await citymaster.countDocuments({'stateId': stateId})
        if (cities) {
            throw new Error("State can't be removed as City Exist!")
        }
        if (!allowDelete) {
            return res.status(200).json({
                IsSuccess: true,
                allowDelete: true,
            })
        }
        let states = await StateMaster.findByIdAndRemove(stateId);

        
        res.status(200).json({
            IsSuccess: true,
            Data: states,
            Message: "Message"
        })
    } catch (err) {
        res.status(400).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};