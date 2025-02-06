// // import Review from "../models/review-model.js";
// // import User from "../models/user-model.js";
// // import Book from "../models/book-model.js";

// // const reviewCtrl={}
// //  reviewCtrl.create=async(req,res)=>{
// //     try{
// //         const body=req.body
// //         const user =await User.findOne({_id:req.currentUser.userId})
// //         if(!user){
// //             return res.status(404).json({error:'something wrong'})
// //         }
// //         if(user.role!='client'){
// //             return res.status(403).json({error:'only client can review books'})
// //         }
       
// //         //const hasAccess=user.rentedBooks.includes(body.reviewEntityId)||user.purchasedBooks.includes(body.reviewEntityId)
// //         const hasRentedBook=user.rentedBooks&&user.rentedBooks.some(ele=>ele.book==body.reviewEntityId)
// //         console.log('hasrentedbooks',hasRentedBook)
// //         const hasPurchasedBook=user.purchasedBooks&&user.purchasedBooks.some(ele=>ele.book==body.reviewEntityId)
// //         if(!hasRentedBook&&!hasPurchasedBook){
// //             return res.status(403).json({error:'you must rent or purchase the book to review it'})
// //         }
        
// //         body.reviewBy=req.currentUser.userId
// //         body.reviewedAt=Date.now()
// //         const review=new Review(body)
// //         await review.save()

// //         const book = await Book.findById(body.reviewEntityId);
// //         if (!book) {
// //             return res.status(404).json({ error: 'Book not found' });
// //         }

// //         // Add the review to the book's reviews array
// //         book.reviews.push(review._id);
// //         await book.save();

// //         res.status(201).json(review);

// //         res.status(201).json(review)
// //     }catch(err){
// //         console.log(err)
// //         res.status(500).json({error:'something went wrong'})
// //     }
// //  }

// // export default reviewCtrl
// import Review from "../models/review-model.js";
// import User from "../models/user-model.js";
// import Book from "../models/book-model.js";
// import Client from "../models/client-model.js"; 

// const reviewCtrl = {};

// reviewCtrl.create = async (req, res) => {
//     try {
//         const body = req.body;
//         const user = await User.findOne({ _id: req.currentUser.userId });

//         if (!user) {
//             return res.status(404).json({ error: 'Something went wrong' });
//         }

//         if (user.role !== 'client') {
//             return res.status(403).json({ error: 'Only clients can review books' });
//         }

       
//         console.log('clientid',user._id)
//         const client = await Client.findOne({ client: user._id }).populate('rentedBooks purchasedBooks');
//         if (!client) {
//             return res.status(404).json({ error: 'Client not foundd' });
//         }
//         console.log('client',client)

//        console.log('rei',body.review.reviewEntityId)
//         const hasRentedBook = client.rentedBooks.find(ele => ele.book == body.review.reviewEntityId);
//         const hasPurchasedBook = client.purchasedBooks.find(ele => ele.book._id== body.review.reviewEntityId);
//         console.log('rent puchase',hasRentedBook,hasPurchasedBook)

//         if (!hasRentedBook && !hasPurchasedBook) {
//             return res.status(403).json({ error: 'You must rent or purchase the book to review it' });
//         }

       
//         body.reviewBy = req.currentUser.userId;
//         body.reviewedAt = Date.now();

//         const review = new Review(body);
//         await review.save();


//        if(body.reviewFor=='Book'){
//         const book = await Book.findById(body.reviewEntityId);
//         if (!book) {
//             return res.status(404).json({ error: 'Book not found' });
//         }
//          book.reviews.push(review._id);
//         await book.save();

//        }else{
//         const oneClient=await Client.findOne({client:body.reviewEntityId})
//        if(!oneClient){
//         return res.status(404).json({error:'client not found'})
//        }
//        oneClient.reviews.push(review._id)
//        }

        

//         res.status(201).json(review);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: err });
//     }
// }

// export default reviewCtrl;
import Review from "../models/review-model.js";
import User from "../models/user-model.js";
import Book from "../models/book-model.js";
import Client from "../models/client-model.js";
import upload from "../middleware/multer.js";
import path from 'path';


const reviewCtrl = {};

reviewCtrl.create = async (req, res) => {
    try {
        const { reviewFor, reviewEntityId, reviewText, rating } = req.body;

        // Ensure the review is for a book
        if (reviewFor !== 'Book') {
            return res.status(400).json({ error: 'Invalid review target' });
        }

        const user = await User.findById(req.currentUser.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'client') {
            return res.status(403).json({ error: 'Only clients can review books' });
        }

        const client = await Client.findOne({ client: user._id }).populate('rentedBooks.book purchasedBooks.book');
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Check if the client has rented or purchased the book
        const hasRentedBook = client.rentedBooks.some(ele => ele.book._id.toString() === reviewEntityId);
        const hasPurchasedBook = client.purchasedBooks.some(ele => ele.book._id.toString() === reviewEntityId);

        if (!hasRentedBook && !hasPurchasedBook) {
            return res.status(403).json({ error: 'You must rent or purchase the book to review it' });
        }
        console.log('path',req.filename)
        console.log('body',req.body)
        ;
        let photoPath=null
        if(req.file){
            photoPath=req.file.path
        }
        // Create the review
        const review = new Review({
            reviewFor,
            reviewEntityId,
            reviewBy: user._id,
            reviewText,
            rating,
            reviewedAt: Date.now(),
            photo:photoPath
        });
       
        await review.save();

        // Associate the review with the book
        const book = await Book.findById(reviewEntityId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        book.reviews.push(review._id);
        await book.save();

        res.status(201).json(review);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}
reviewCtrl.getBook=async(req,res)=>{
    try{
        const bid=req.params.id
        const reviews=await Review.find({reviewEntityId:bid})
        if(!reviews){
            return res.status(404).json({error:'reviews not found'})
        }
        res.json(reviews)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
export default reviewCtrl;

