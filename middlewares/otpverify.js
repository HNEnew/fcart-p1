
 const accountSid = "AC1a55837f2d1450c60adda04e88fcf905"
 const authToken = "aee7eefac93472ab6e335835c48a2a95"

let userphone
const verifySid = "VA841fee427989aad85960b5358b9ba3b3";
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
