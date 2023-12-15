
 const accountSid = process.env.TWILIO_ACCOUNT_SID
 const authToken = process.env.TWILIO_AUTH_TOKEN

let userphone
const verifySid = process.env.ServiceSID;
const client = require("twilio")(accountSid,authToken);
module.exports.senduser_otp = (req, res, next) => {
    userphone = req.userphone || req.body.phone
    console.log(userphone)
    client.verify.v2
        .services(verifySid)
        .verifications.create({ to: "+91"+userphone, channel: "sms" })
        .then((verification) => console.log(verification.status))
        .then(res.json({otp:'An otp has send to your number'}))
        .catch(err=>console.log(err))
}

module.exports.verifyuserlogin_otp = async (req, res, next) => {
    const otpcode = await req.body.otpcode
    console.log(otpcode)
    try{
        const verifiedresponse = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+91"+userphone, code: otpcode })
        .then((verification_check) => {
            console.log(verification_check.status)
            if(verification_check.status == 'approved'){
                res.json({ succes: 'authentication succes..' })
            }else{
                res.clearCookie('usertoken')
                res.json({ failure: 'incorrect otp' })
            }
        })
    }catch(Error){
        console.log(Error);
    }
}
