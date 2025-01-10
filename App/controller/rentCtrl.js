import Book from "../models/book-model.js";
import Rent from "../models/rental-model.js";

const rentCtrl={}
rentCtrl.create=async(req,res)=>{
    try{
        const body=req.body
        body.vendor=req.currentUser.userId
        const book=await Book.findById(body.book)
        if(!book){
            return res.status(404).json({error:'book not found'})
        }
        if(book.vendor!=body.vendor){
            return res.status(400).json({error:'you are not authorized to create the rental details of this book'})
        }
        const rent=new Rent(body)

        await rent.save()
        res.status(201).json(rent)

    }catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}

export default rentCtrl