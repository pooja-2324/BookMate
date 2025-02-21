import nodemailer from 'nodemailer'

const transporter=nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})
export const notifyClient=async(clientEmail,message)=>{
    const mailOptions={
        from:process.env.EMAIL_USER,
        to:clientEmail,
        subject:message.subject,
        text:message.text,
        html:message.html
    }
    try{
        const info=await transporter.sendMail(mailOptions)
    }catch(err){
        console.error('error sending email',err)
    }
}