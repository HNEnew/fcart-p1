
// const accountSid = process.env.TWILIO_ACCOUNT_SID
// const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = "AC1a55837f2d1450c60adda04e88fcf905"
const authToken = "cfcf6b2fd04801bc22fbdafefdb73acf"

const verifySid = "VA841fee427989aad85960b5358b9ba3b3";
const client = require("twilio")(accountSid, authToken);
module.exports.senduser_otp = (req, res, next) => {
    client.verify.v2
        .services(verifySid)
        .verifications.create({ to: "+919400078881", channel: "sms" })
        .then((verification) => console.log(verification.status))
}

module.exports.verifyuserlogin_otp = async (req, res, next) => {
    const otpcode = await req.body.otpcode
    console.log(otpcode)
    try{
        const verifiedresponse = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+919400078881", code: otpcode })
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