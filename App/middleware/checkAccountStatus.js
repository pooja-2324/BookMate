import User from "../models/user-model.js"

 export const AccountStatus=async(req,res,next)=>{
    try{
        const user=await User.findOne(req.currentUser.userId)
        if(user.status=='active'){
            next()
        }
        else{
            return res.status(400).json({error:"your account is deactivated, please contact admin"})
        }
    }catch(err){
        console.log('status error',err)
        res.status(500).json({error:'something went wrong'})
    }
}