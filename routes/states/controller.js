const StateMaster = require('../../model/statemaster');
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
        res.status(500).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};

exports.removeItem = async (req, res, next) => {
    try {
        let { stateId } = req.params;
        if (!stateId) throw new Error('Invalide data supplide!')

        let states = await StateMaster.remove({ '_id': stateId });
        res.status(200).json({
            IsSuccess: true,
            Data: states,
            Message: "Message"
        })
    } catch (err) {
        res.status(400).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};