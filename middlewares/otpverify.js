
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
// const accountSid = "AC1a55837f2d1450c60adda04e88fcf905"
// const authToken = "cfcf6b2fd04801bc22fbdafefdb73acf"
let userphone
const verifySid = "VA4fd96d19d8a0ded60b863c490ece9914";
const client = require("twilio")(accountSid, authToken);
module.exports.senduser_otp = (req, res, next) => {
    userphone = req.userphone
    console.log(userphone)
    client.verify.v2
        .services(verifySid)
        .verifications.create({ to: "+91"+userphone, channel: "sms" })
        .then((verification) => console.log(verification.status))
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