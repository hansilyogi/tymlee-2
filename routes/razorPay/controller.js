let Razorpay = require('razorpay');
let moment = require('moment');


const instance = new Razorpay({
    key_id: 'rzp_test_a7VSGEl5KTwOCV',
    key_secret: 'DmqUrNTJYxDuNUENnU3bI4eu',
  });

exports.generateOrderNo = async (req, res, next) => {
    try {
        let {amount, currency, userId, companyId, companyName, serviceProviderName, serviceProviderId } = req.body;
        if (!amount || !userId) {
            throw new Error('Invalid User or amount!')
        }

        let receipt = `bk_${moment().format('YYYYMMDDHHMMs')}`
        let d = await instance.orders.create({amount, currency: currency || "INR", receipt: receipt, payment_capture: true, notes: {userId, companyId, companyName, serviceProviderName, serviceProviderId, actionOn: new Date()}})
        res.status(200).json({
            IsSuccess: true,
            Data: d,
            Message: "Message"
        })
    } catch(err) {
        res.status(500).json({ Message: err.message || err, Data: null, IsSuccess: false });
    }
};