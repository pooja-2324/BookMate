import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import twilio from 'twilio'
import axios from 'axios'
import crypto from "crypto"
import dotenv from 'dotenv'
dotenv.config()
import { validationResult } from 'express-validator';
import User from "../models/user-model.js";
 const userCtrl={}

 userCtrl.register=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
       return  res.status(400).json({errors:errors.array()})
    }
    try{
        const body=req.body
        const user=new User(body)
        const salt=await bcryptjs.genSalt()
        const hash=await bcryptjs.hash(body.password,salt)
        
        user.password=hash
        const count= await User.countDocuments()
        
        if(count==0){
            user.role='admin'
        }
        await user.save()
        res.status(201).json(user)


    }catch(err){
        console.log('error',err)
        res.status(500).json({error:'something went wrong'})

    }
 }

 userCtrl.login=async(req,res)=>{
    try{
        const body=req.body
        const user=await User.findOne({email:body.email})
        

        if(!user){
            return res.status(404).json({error:'invalid email/password'})
        }
       if(user.status=='inactive'){
        return res.status(400).json({error:'your account is deactivated ,please contact admin'})

       }
       const isValidate= bcryptjs.compare(body.password,user.password)
       
       if(!isValidate){
        return res.status(400).json({error:'invalid email/password'})
       }

       const token=jwt.sign({userId:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'7d'})
    
       res.json({token:`Bearer ${token}`})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrongg'})
    }
 }

userCtrl.getOtp=async(req,res)=>{
    try{
        const {phone} =req.body
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER, // Twilio phone number
            to: phone // User's phone number
        });

        // Store OTP and its expiration in the session
        req.session.otp = otp;
        req.session.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

        res.json({ message: 'OTP sent successfully' });
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something wnet wrong'})

    }
}
userCtrl.verifyOtp=async(req,res)=>{
    const {otp,phone}=req.body
    console.log('session',req.session.otp)

    if (req.session.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (Date.now() > req.session.otpExpiry) {
        return res.status(400).json({ error: 'OTP has expired' });
    }

    // Proceed with generating JWT token or other logic
    const user = await User.findOne({ phone });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token: `Bearer ${token}` });
}

 userCtrl.account=async(req,res)=>{
    try{
        const user=await User.findById(req.currentUser.userId)
        if(!user){
            return res.status(404).json({error:'user not found'})
        }
        res.json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
 }

 export default userCtrl