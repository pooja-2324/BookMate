import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import twilio from 'twilio'
import Client from '../models/client-model.js'
import Vendor from '../models/vendor-model.js'
import dotenv from 'dotenv'
import upload from "../middleware/multer.js"
import fs from 'fs'
import cloudinary from '../../config/cloudinary-profile.js'
dotenv.config()
import Stripe from 'stripe'
import { validationResult } from 'express-validator';
import User from "../models/user-model.js";

 const userCtrl={}
 const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)
userCtrl.count=async(req,res)=>{
    try{
        const count=await User.countDocuments()
        res.json({count})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'error fetching count'})
    }
}

//  userCtrl.register=async(req,res)=>{
//     const errors=validationResult(req)
//     if(!errors.isEmpty()){
//        return  res.status(400).json({errors:errors.array()})
//     }
//     try{
//         const body=req.body
//         const user=new User(body)
//         const salt=await bcryptjs.genSalt()
//         const hash=await bcryptjs.hash(body.password,salt)
        
//         user.password=hash
//         const count= await User.countDocuments()
        
//         if(count==0){
//             user.role='admin'
//         }
//         await user.save()
//         if (body.role === 'client') {
//             const client=new Client({
//                 client: user._id,
//                 wallet: 0, 
//                 rentedBooks: [],
//                 purchasedBooks: [],
//                 reviews:[]
//             });
//             await client.save();
//         }
//         else if (body.role === 'vendor') {
//             const vendor=new Vendor({
//                 vendor: user._id,
//                 uploadedBooks: [],
//                 totalEarnings: [],
//                 reviews:[]
//             });
//             const vendorAccount = await stripe.accounts.create({
//                 type: 'express', // or 'standard' depending on your use case
//                 country: 'US', // Replace with the vendor's country
//                 email: user.email, // Replace with the vendor's email
//                 capabilities: {
//                   card_payments: { requested: true },
//                   transfers: { requested: true },
//                 },
//               });
//             await vendor.save();
//         }
//         res.status(201).json(user)


//     }catch(err){
//         console.log('error',err)
//         res.status(500).json({error:'something went wrong'})

//     }
//  }
userCtrl.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const body = req.body;
  
      // Validate the role
      if (body.role !== 'client' && body.role !== 'vendor') {
        return res.status(400).json({ error: 'Invalid role. Role must be "client" or "vendor".' });
      }
  
      // Hash the password
      const salt = await bcryptjs.genSalt();
      const hash = await bcryptjs.hash(body.password, salt);
  
      // Create the user
      const user = new User({
        ...body,
        password: hash,
      });
  
      // Set the role to 'admin' if it's the first user
      const count = await User.countDocuments();
      if (count === 0) {
        user.role = 'admin';
      }
  
      // Save the user
      await user.save();
  
      // Create a client or vendor based on the role
      if (body.role === 'client') {
        const client = new Client({
          client: user._id,
          wallet: 0,
          rentedBooks: [],
          purchasedBooks: [],
          reviews: [],
        });
        await client.save();
      } else if (body.role === 'vendor') {
        // Create a Stripe connected account for the vendor
        let vendorAccount;
        try {
          vendorAccount = await stripe.accounts.create({
            type: 'express', // or 'standard' depending on your use case
            country: 'US', // Replace with the vendor's country
            email: user.email, // Use the user's email
            capabilities: {
              card_payments: { requested: true },
              transfers: { requested: true },
            },
          });
        } catch (stripeErr) {
          console.error('Error creating Stripe connected account:', stripeErr);
          return res.status(500).json({ error: 'Failed to create Stripe account for vendor' });
        }
  
        // Create the vendor and save the Stripe account ID
        const vendor = new Vendor({
          vendor: user._id,
          uploadedBooks: [],
          totalEarnings: [],
          reviews: [],
          stripeAccountId: vendorAccount.id, // Save the Stripe account ID
        });
        await vendor.save();
      }
  
      // Return the created user
      res.status(201).json(user);
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
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
       const isValidate= await bcryptjs.compare(body.password,user.password)
       
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

 userCtrl.getOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        // Input validation
        if (!phone || typeof phone !== 'string') {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Initialize Twilio client
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

        // Send OTP via Twilio
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER, // Twilio phone number
            to: phone,
        });

        // Store OTP and expiry in session
        req.session.otp = otp;
        console.log("Session data:", req.session.otp);

        req.session.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error('Error in getOtp:', err);

        // Handle Twilio-specific errors
        if (err.code === 21211) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        res.status(500).json({ error: 'Something went wrong' });
    }
};

userCtrl.verifyOtp = async (req, res) => {
    try {
        const { otp, phone } = req.body;

        // Input validation
        if (!otp || !phone) {
            return res.status(400).json({ error: 'OTP and phone number are required' });
        }
        console.log("Session data:", req.session.otp);

        // Check if OTP matches
        if (req.session.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Check if OTP has expired
        if (Date.now() > req.session.otpExpiry) {
            return res.status(400).json({ error: 'OTP has expired' });
        }

        // Find user by phone number
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // Clear OTP from session after successful verification
        req.session.otp = null;
        req.session.otpExpiry = null;

        res.json({ token: `Bearer ${token}` });
    } catch (err) {
        console.error('Error in verifyOtp:', err);
        res.status(500).json({ error: 'Something went wrong',err });
    }
};

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
 
 

userCtrl.updateProfilePic = async (req, res) => {
    try {
        const user = await User.findById(req.currentUser.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("Uploading file:", req.file.path);

        // Step 1: Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "profile_pictures", // Ensure images are organized
        });

        console.log("Cloudinary Upload Success:", result.public_id);

        // Step 2: Delete old profile picture (except the default one)
        if (user.profilePic?.public_id && user.profilePic.public_id !== "default_profile_cikqzr") {
            await cloudinary.uploader.destroy(user.profilePic.public_id);
            console.log("Deleted old profile picture:", user.profilePic.public_id);
        }

        // Step 3: Update user profile with new image URL
        user.profilePic = {
            url: result.secure_url, // Secure URL
            public_id: result.public_id, // Store public_id for future deletions
        };

        await user.save();

        res.json(user);

    } catch (err) {
        console.error("Profile Picture Update Error:", err);
        res.status(500).json({ error: "Something went wrong in profile updating" });
    }
};

    userCtrl.update=async(req,res)=>{
        try{
            const body=req.body
            const user=req.currentUser.userId
            const result=await User.findByIdAndUpdate({_id:user},body,{new:true,runValidators:true})
            if(!result){
                return res.status(404).json({error:'user not found'})
            }
            res.json(result)
        }catch(err){
            res.status(500).json({error:'something went wrong'})
        }
    }

    // userCtrl.googleSignIn = async (req, res) => {
    //     try {
    //         const { idToken } = req.body; // Accept role from request
    
    //         if (!role || !['client', 'vendor'].includes(role)) {
    //             return res.status(400).json({ error: 'Role must be either client or vendor' });
    //         }
    
    //         // Verify Google ID Token
    //         const ticket = await client.verifyIdToken({
    //             idToken,
    //             audience: process.env.GOOGLE_CLIENT_ID,
    //         });
    
    //         const payload = ticket.getPayload();
    //         const { email, name, picture, sub } = payload;
    
    //         // Check if user already exists
    //         let user = await User.findOne({ email });
    
         
    
    //         // Generate JWT token
    //         const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    //             expiresIn: "7d",
    //         });
    
    //         res.json({ token: `Bearer ${token}`, user });
    
    //     } catch (err) {
    //         console.error("Error in Google Sign-In:", err);
    //         res.status(500).json({ error: "Something went wrong" });
    //     }
    // };
    userCtrl.all=async(req,res)=>{
        try{
            const users=await User.find()
            res.json(users)
        }catch(err){
            console.log(err)
            res.status(500).json({error:'something went wrong'})
        }
    }
 export default userCtrl