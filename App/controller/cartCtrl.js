import Book from "../models/book-model.js"
import Cart from "../models/cart-model.js"
import Rent from "../models/rental-model.js"
const cartCtrl={}

cartCtrl.listAll=async(req,res)=>{
    try{
        const client=req.currentUser.userId
        console.log('client',client)
        const cartDatas=await Cart.find({client})
        .populate('book')
        .populate('rent')
        res.json(cartDatas)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
cartCtrl.addToCart=async(req,res)=>{
    try{
        const {bid}=req.params
        const user=req.currentUser.userId
        const book=await Book.findById(bid)
        if(!book){
            return res.status(404).json({error:'book not found'})
        }
        const rent=await Rent.find({book:bid})
        if(!rent){
            return res.status(404).json({error:'rent not found'})
        }
        console.log('id',rent[0]._id)
        const existingCartItem = await Cart.findOne({ client:user, book: book });
        if (existingCartItem) {
            return res.status(400).json({ error: "Book is already in your cart" });
        }
        const newCartItem=new Cart({
            client:user,
            book:book,
            rent:rent[0]
        })
        await newCartItem.save()
        console.log(newCartItem)
        res.json(newCartItem)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
cartCtrl.remove=async(req,res)=>{
    try{
        const client=req.currentUser.userId
        const id=req.params.id
        const cart=await Cart.findOneAndDelete({_id:id,client})
        if(!cart){
            return res.status(500).json({error:'cart not found'})
        }
        res.json(cart)

    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
cartCtrl.clear=async(req,res)=>{
    try{
        const user=req.currentUser.userId
        const response=await Cart.deleteMany({client:user})
        res.json(null)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}

export default cartCtrl