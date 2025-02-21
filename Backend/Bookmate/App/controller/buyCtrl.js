import Buy from "../models/selling-model.js";
import Book from "../models/book-model.js";
import Client from "../models/client-model.js";
import Vendor from "../models/vendor-model.js";
import { validationResult } from "express-validator";

 const buyCtrl={}
 buyCtrl.details=async(req,res)=>{
    // const errors=validationResult(req)
    // if(!errors.isEmpty()){
    //     return res.status(400).json({error:errors.array()})
    // }
    try{
        const body=req.body
        const {bid}=req.params
        
        body.vendor=req.currentUser.userId
        const book=await Book.findById(bid)
        if(!book){
            return res.status(404).json({error:'book not found'})
        }
        if(book.vendor!=body.vendor){
            return res.status(400).json({error:'you are not authorized to create sell details of this book'})
        }
        const buy=new Buy(body)
        buy.sellPrice=book.sellPrice
        buy.book=book._id
        
        await buy.save()
        res.status(201).json(buy)


    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
 }
 buyCtrl.placeOrder=async(req,res)=>{
    try{
        const {bid}=req.params
        const buy=await Buy.findById(bid)
        if(!buy){
            return res.status(404).json({error:'details not found'})
        }
        const book=await Book.find({_id:buy.book})
        console.log('book',book)
        if(book.length==0){
            return res.status(404).json({error:'book not found'})
        }
        if(book.status=='notAvailable'||book.status=='withdrawn'){
            return res.status(400).json({error:'book is not available now'})
        }
        await Buy.findByIdAndUpdate(bid,{
            client:req.currentUser.userId,
            deliveryStatus:'orderPlaced'
        })
        await Book.findByIdAndUpdate(buy.book, { status: 'notAvailable' });

        const clientId = req.currentUser.userId; 
        await Client.findOneAndUpdate({client:clientId}, {
            $push: {
                purchasedBooks: {
                    book: buy.book._id,
                    buyingDetails: buy._id
                }
            }
        },{new:true})
        await Vendor.findOneAndUpdate({vendor:buy.vendor}, {
            $push: {
                totalEarnings: {
                  book: buy.book._id,
                  earnings: buy.sellPrice,
                },
              },
        },{new:true});
        res.json({message:'order placed successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
 }
 buyCtrl.orderPlaced=async(req,res)=>{
    try{
        const vendor=req.currentUser.userId
        const books=await Buy.find({deliveryStatus:'order placed',vendor}).populate('client').populate('book')
        if(!books){
            return res.status(404).json({error:'books not found'})
        }
        res.json(books)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
 }
 buyCtrl.toDelivered=async(req,res)=>{
    try{
      const id=req.params.id
      const vendor=req.currentUser.userId
      const buy=await Buy.findOneAndUpdate({_id:id,vendor},{deliveryStatus:'delivered'},{new:true,runValidators:true})
      if(!buy){
      return res.status(404).json({error:'buy not found'})
      }
      res.json(buy)
  
    }catch(err){
      console.log(err)
      res.status(500).json({error:'something went wrong'})
    }
  }

 export default buyCtrl