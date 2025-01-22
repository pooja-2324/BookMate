import Book from "../models/book-model.js";
import Rent from "../models/rental-model.js";
import Client from "../models/client-model.js";
import Vendor from "../models/vendor-model.js";

const rentCtrl={}
rentCtrl.details=async(req,res)=>{
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
rentCtrl.placeOrder=async(req,res)=>{
    try{
        const {rid}=req.params
        const rent=await Rent.findById(rid)
        if(!rent){
            return res.status(404).json({error:'rent details not found'})
        }
        if(rent.rentedBookStatus=='active'){
            return res.status(400).json({error:'already order placed'})
        }
        const rentalStartDate = new Date()
        const dueDate = new Date(rentalStartDate)
        dueDate=dueDate.setDate(rentalStartDate.getDate() + rent.period)

       
        await Rent.findByIdAndUpdate(rid, {
            client: req.currentUser.userId,
            rentalStartDate,
            dueDate,
            rentedBookStatus: 'active'
        });

       
        await Book.findByIdAndUpdate(rent.book, { status: 'notAvailable' });

        
        const clientId = req.currentUser.userId; 
        await Client.findOneAndUpdate({client:clientId}, {
            $push: {
                rentedBooks: {
                    book: rent.book._id,
                    rentDetails: rent._id
                }
            }
        });
        
        await Vendor.findOneAndUpdate({vendor:rent.vendor}, {
            $inc: { totalEarnings: rent.pricing.readingFee }
        });

        res.json({message:'order placed successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
rentCtrl.return=async(req,res)=>{
    try{
        const {rid} =req.params
        const rent=await Rent.findById(rid)
        if(!rent){
            return res.status(404).json({error:'rent details not found'})
        }
        const returnDate = new Date();
        console.log('rd dd',returnDate,rent.dueDate)
        const lateFee = rent.dueDate < returnDate ? (returnDate - rent.dueDate) / (1000 * 60 * 60 * 24) * 10 : 0; // Calculate late fee for each day over due date
        const damageFee = rent.isDamaged ? 30 : 0
        await Rent.findByIdAndUpdate(rid,{
            rentedBookStatus:'completed',
            returnedDate:returnDate,
            lateFee,
            damageFee
        })
        await Book.findByIdAndUpdate(rent.book, { status: 'available' });
        await Vendor.findOneAndUpdate({vendor:rent.vendor}, {
            $inc: { totalEarnings: rent.pricing.readingFee + lateFee + damageFee }
        });
        res.json({message:'book returned successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
export default rentCtrl