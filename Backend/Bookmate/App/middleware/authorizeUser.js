export const AuthorizeUser=(permittedRoles)=>{
    return (req,res,next)=>{
        if(permittedRoles.includes(req.currentUser.role)){
            next()
        }else{
            res.status(500).json({error:'unauthorized token'})
        }
    }
}
 