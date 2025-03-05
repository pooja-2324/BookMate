import jwt from 'jsonwebtoken'
export const AuthenticateUser=async(req,res,next)=>{
    let token=req.headers['authorization']
    if(!token){
        return res.status(404).json({error:'token not found'})
    }
    token=token.split(' ')[1]
    try{
        const tokenData=jwt.verify(token,process.env.JWT_SECRET)
        req.currentUser={userId:tokenData.userId,role:tokenData.role}
        next()
        
    }catch(err){
        console.log(err)
        return res.status(500).json({error:'something went wrong in authentication'})

    }
}