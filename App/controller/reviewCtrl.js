import Review from "../models/review-model.js";
const reviewCtrl={}
 reviewCtrl.create=async(req,res)=>{
    try{
        const body=req.body
        body.reviewBy=req.currentUser.userId
        const review=new Review(body)
        await review.save()

    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
 }

export default reviewCtrl