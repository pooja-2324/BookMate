import Book from "../models/book-model.js"
import Cart from "../models/cart-model.js"
import Rent from "../models/rental-model.js"
import Buy from "../models/selling-model.js"
import Order from "../models/order-model.js"
const cartCtrl={}

cartCtrl.listAll=async(req,res)=>{
    try{
        const client=req.currentUser.userId
        console.log('client',client)
        const cartDatas=await Cart.find({client})
        .populate('book')
        .populate('rent')
        .populate('buy')
        res.json(cartDatas)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
// cartCtrl.addToCart=async(req,res)=>{
//     try{
//         const {bid}=req.params
//         const user=req.currentUser.userId
//         const book=await Book.findById(bid)
//         if(!book){
//             return res.status(404).json({error:'book not found'})
//         }
//         const rent=await Rent.find({book:bid})
//         if(!rent){
//             return res.status(404).json({error:'rent not found'})
//         }
//         const buy=await Buy.find({book:bid})
//         if(!buy){
//             return res.status(404).json({error:'buy not found'})
//         }
//         console.log('id',rent[0]._id)
//         const existingCartItem = await Cart.findOne({ client:user, book: book });
//         if (existingCartItem) {
//             return res.status(400).json({ error: "Book is already in your cart" });
//         }
//         const newCartItem=new Cart({
//             client:user,
//             book:book,
//             rent:rent[0],
//             buy:buy[0]
//         })
//         await newCartItem.save()
//         console.log(newCartItem)
//         res.json(newCartItem)
//     }catch(err){
//         console.log(err)
//         res.status(500).json({error:'something went wrong'})
//     }
// }
cartCtrl.addToCart = async (req, res) => {
    try {
        const { bid } = req.params;
        const { action } = req.body; // Expecting "buy" or "rent"
        const user = req.currentUser.userId;

        // Find book
        const book = await Book.findById(bid);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        // Initialize rent and buy variables
        let rent = null, buy = null;

        // Fetch rent details only if action is "rent"
        if (action === "rent") {
            rent = await Rent.findOne({ book: bid });
            if (!rent) {
                return res.status(404).json({ error: "Rent details not found" });
            }
        }

        // Fetch buy details only if action is "buy"
          // Fetch buy details only if action is "buy" and book is available for sale
          if (action === "buy" && book.isSelling) {
            buy = await Buy.findOne({ book: bid });
            if (!buy) {
                return res.status(404).json({ error: "Buy detailss not found" });
            }
        } else if (action === "buy" && !book.isSelling) {
            return res.status(400).json({ error: "This book is not available for purchase." });
        }

        // Check if the book is already in the cart
        const existingCartItem = await Cart.findOne({ client: user, book: book._id });

        if (existingCartItem) {
            // Remove the previous cart entry to replace with the new selection
            await Cart.findOneAndDelete({ client: user, book: book._id });
        }

        // Create new cart entry with only rent or buy based on action
        const newCartItem = new Cart({
            client: user,
            book: book._id,
            rent: rent ? rent._id : null,
            buy: buy ? buy._id : null
        });

        await newCartItem.save();
        res.status(201).json({ message: `Added to cart for ${action}`, cartItem: newCartItem });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

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