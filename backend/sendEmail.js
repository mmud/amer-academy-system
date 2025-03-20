const nodemailer = require("nodemailer");

const sendEmail= async(options)=>
{
    const transporter = await nodemailer.createTransport({
        host:process.env.HOST,
        service:process.env.EMAIL_SERVICE,
        port:Number(process.env.EMAIL_PORT),
        secureConnection:Boolean(process.env.SECURE),
        auth:{
            user:process.env.EMAIL_FROM,
            pass:process.env.EMAIL_PASSWORD
        }
    });
    
    const mailOptions={
        from:process.env.EMAIL_FROM,
        to:options.to,
        subject:options.subject,
        html:options.text
    };

    await transporter.sendMail(mailOptions,function(err,info){
        if(err)
            console.log(err);
        else
            console.log(info);
    });
}

module.exports =sendEmail;