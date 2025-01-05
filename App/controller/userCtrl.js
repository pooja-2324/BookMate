import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
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
        console.log('user',user)

        if(!user){
            return res.status(404).json({error:'invalid email/password'})
        }
       if(user.status=='inactive'){
        return res.status(400).json({error:'your account is deactivated ,please contact admin'})

       }
       const isValidate= bcryptjs.compare(body.password,user.password)
       console.log('isValidate',isValidate)
       if(!isValidate){
        return res.status(400).json({error:'invalid email/password'})
       }

       const token=jwt.sign({userId:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'7d'})
       console.log('token',token)
       res.json({token:`Bearer ${token}`})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
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