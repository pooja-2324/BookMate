import nodemailer from 'nodemailer'

const transporter=nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})
export const notifyVendor=async(vendorEmail,orderDetails)=>{
    const mailOptions={
        from:process.env.EMAIL_USER,
        to:vendorEmail,
        subject:'New Order Placed',
        text:`A new order has been placed :${JSON.stringify(orderDetails)}`,
        html: `<strong>New Order Details:</strong><br>${JSON.stringify(orderDetails)}`
    }
    try{
        const info=await transporter.sendMail(mailOptions)
        console.log('Email send to vendor',info)
    }catch(err){
        console.error('error sending email',err)
    }
}
