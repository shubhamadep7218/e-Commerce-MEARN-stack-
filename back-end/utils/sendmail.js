const nodemailer = require('nodemailer')

const sendEmail = async(obj)=>{

    const transporter = nodemailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        },
    })

    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:obj.email,
        subject:obj.subject,
        text:obj.message,
    }

    await transporter.sendMail(mailOptions);

}

module.exports = sendEmail