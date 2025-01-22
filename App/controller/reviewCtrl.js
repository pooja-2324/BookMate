// import Review from "../models/review-model.js";
// import User from "../models/user-model.js";
// import Book from "../models/book-model.js";

// const reviewCtrl={}
//  reviewCtrl.create=async(req,res)=>{
//     try{
//         const body=req.body
//         const user =await User.findOne({_id:req.currentUser.userId})
//         if(!user){
//             return res.status(404).json({error:'something wrong'})
//         }
//         if(user.role!='client'){
//             return res.status(403).json({error:'only client can review books'})
//         }
       
//         //const hasAccess=user.rentedBooks.includes(body.reviewEntityId)||user.purchasedBooks.includes(body.reviewEntityId)
//         const hasRentedBook=user.rentedBooks&&user.rentedBooks.some(ele=>ele.book==body.reviewEntityId)
//         console.log('hasrentedbooks',hasRentedBook)
//         const hasPurchasedBook=user.purchasedBooks&&user.purchasedBooks.some(ele=>ele.book==body.reviewEntityId)
//         if(!hasRentedBook&&!hasPurchasedBook){
//             return res.status(403).json({error:'you must rent or purchase the book to review it'})
//         }
        
//         body.reviewBy=req.currentUser.userId
//         body.reviewedAt=Date.now()
//         const review=new Review(body)
//         await review.save()

//         const book = await Book.findById(body.reviewEntityId);
//         if (!book) {
//             return res.status(404).json({ error: 'Book not found' });
//         }

//         // Add the review to the book's reviews array
//         book.reviews.push(review._id);
//         await book.save();

//         res.status(201).json(review);

//         res.status(201).json(review)
//     }catch(err){
//         console.log(err)
//         res.status(500).json({error:'something went wrong'})
//     }
//  }

// export default reviewCtrl
import Review from "../models/review-model.js";
import User from "../models/user-model.js";
import Book from "../models/book-model.js";
import Client from "../models/client-model.js"; 

const reviewCtrl = {};

reviewCtrl.create = async (req, res) => {
    try {
        const body = req.body;
        const user = await User.findOne({ _id: req.currentUser.userId });

        if (!user) {
            return res.status(404).json({ error: 'Something went wrong' });
        }

        if (user.role !== 'client') {
            return res.status(403).json({ error: 'Only clients can review books' });
        }

       
        const client = await Client.findOne({ client: user._id }).populate('rentedBooks.book purchasedBooks.book');
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

       
        const hasRentedBook = client.rentedBooks.find(ele => ele.book._id.toString() === body.reviewEntityId.toString());
        const hasPurchasedBook = client.purchasedBooks.find(ele => ele.book._id.toString() === body.reviewEntityId.toString());

        if (!hasRentedBook && !hasPurchasedBook) {
            return res.status(403).json({ error: 'You must rent or purchase the book to review it' });
        }

       
        body.reviewBy = req.currentUser.userId;
        body.reviewedAt = Date.now();

        const review = new Review(body);
        await review.save();


       if(body.reviewFor=='Book'){
        const book = await Book.findById(body.reviewEntityId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
         book.reviews.push(review._id);
        await book.save();

       }else{
        const oneClient=await Client.findById(body.reviewEntityId)
       if(!oneClient){
        return res.status(404).json({error:'client not found'})
       }
       oneClient.reviews.push(review._id)
       }

        

        res.status(201).json(review);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export default reviewCtrl;
