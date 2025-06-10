const jwt = require('jsonwebtoken');
const moment = require('moment');
const { saveOtp, getUserByPhoneAndOtp } = require('../models/user.model');

// Send OTP

const  sendOtp=(req,res)=>{
    const {phone} = req.body;

    if(!phone)  return res.status(404).json({message:"Phone Number Required"});

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = moment().add(process.env.OTP_EXPIRE_MINUTES || 5, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    saveOtp(phone, otp, expiry, (err)=>{
        if(err) return res.status(500).json({message:"DB Error", error:err});

        console.log(`Otp for ${phone}: ${otp}`);
        return res.status(200).json({message:"Otp Sent Successfully"});
    });
};



const verifyOtp = (req, res) => {
    const {phone,otp} = req.body;
    if(!phone || !otp) return res.status(404).json({message:"Phone and OTP Required"});

    getUserByPhoneAndOtp(phone, otp, (err, results) => {
        if(err) return res.status(500).json({message:"DB Error", error:err});

        const user = results[0];
        if(!user) return res.status(404).json({message:"Invalid OTP or Phone"});

        const now = moment();
        const expiry = moment(user.otp_expiry);

        if(now.isAfter(expiry)) return res.status(404).json({message:"OTP Expired"});

        const token = jwt.sign({id:user.id, phone:user.phone}, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        return res.status(200).json({
            message:"Login Successful",
            token,
            user:{
                id:user.id,
                phone:user.phone,
                name:user.fullName || '',
                role:user.role || '',
            },
        });
    });

};

module.exports = {
    sendOtp,
    verifyOtp
};