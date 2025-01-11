import Review from "../models/review-model.js";
import User from "../models/user-model.js";

const reviewCtrl={}
 reviewCtrl.create=async(req,res)=>{
    try{
        const body=req.body
        const user =await User.findOne({_id:req.currentUser.userId})
        if(!user){
            return res.status(404).json({error:'something wrong'})
        }
        if(user.role!='client'){
            return res.status(403).json({error:'only client can review books'})
        }
       
        //const hasAccess=user.rentedBooks.includes(body.reviewEntityId)||user.purchasedBooks.includes(body.reviewEntityId)
        const hasRentedBook=user.rentedBooks&&user.rentedBooks.find(ele=>ele.book==body.reviewEntityId)
        const hasPurchasedBook=user.purchasedBooks&&user.purchasedBooks.find(ele=>ele.book==body.reviewEntityId)
        if(!hasRentedBook&&!hasPurchasedBook){
            return res.status(403).json({error:'you must rent or purchase the book to review it'})
        }
        
        body.reviewBy=req.currentUser.userId
        body.reviewedAt=Date.now()
        const review=new Review(body)
        await review.save()
        res.status(201).json({review})

    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
 }

export default reviewCtrl