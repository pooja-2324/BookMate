import cloudinary from '../../config/cloudinary-profile.js'
import Review from "../models/review-model.js";
import User from "../models/user-model.js";
import Book from "../models/book-model.js";
import Client from "../models/client-model.js";
import upload from "../middleware/multer.js";
import fs from 'fs'


const reviewCtrl = {};

reviewCtrl.create = async (req, res) => {
    try {
      const { reviewFor, reviewEntityId, reviewText, rating } = req.body;
      console.log('Request Body:', req.body); // Debugging
      console.log('Request Files:', req.files); // Debugging
  
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
  
      const client = await Client.findOne({ client: user._id }).populate(
        'rentedBooks.book purchasedBooks.book'
      );
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
  
      // Check if the client has rented or purchased the book
      const hasRentedBook = client?.rentedBooks?.some(
        (ele) => ele.book?._id.toString() === reviewEntityId
      );
      const hasPurchasedBook = client.purchasedBooks?.some(
        (ele) => ele.book?._id.toString() === reviewEntityId
      );
  
      if (!hasRentedBook && !hasPurchasedBook) {
        return res.status(403).json({
          error: 'You must rent or purchase the book to review it',
        });
      }
  
      
  
      const review = new Review({
        reviewFor,
        reviewEntityId,
        reviewBy: user._id,
        reviewText,
        rating,
        reviewedAt: Date.now()
      });
  
      await review.save();
      console.log('Review:', review);
  
      // Associate the review with the book
      const book = await Book.findById(reviewEntityId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      const reviews = await Review.find({ reviewEntityId: book._id });
      const total = reviews.reduce((acc, cv) => acc + cv.rating, 0);
      const average = total / reviews.length;
  
      await Book.findByIdAndUpdate(
        reviewEntityId,
        {
          $push: { reviews: review._id },
          $set: { totalRating: average },
        },
        { new: true }
      );
  
      res.status(201).json({ review, average });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  
reviewCtrl.getReview=async(req,res)=>{
  try{
    const {rid}=req.params
    const review=await Review.findById(rid).populate('reviewEntityId')
    if(!review){
      return res.status(404).json({error:'review not found'})
    }
    res.json(review)
  }catch(err){
    console.log(err)
    res.status(500).json({error:'something went wrong in getting one review'})
  }
}
reviewCtrl.upload = async (req, res) => {
  try {
    console.log('file',req.files)
    try{
      const {rid}=req.params
      const review=await Review.findById(rid)
      console.log('review',review)
      if(!review){
        return res.status(404).json({error:'review not found'})
      }
      const photo = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'review_images', // Optional: Organize images in a folder
          });
          photo.push({
            url: result.secure_url,
            public_id: result.public_id,
          });
          
          
          // Delete the temporary file after uploading to Cloudinary
          fs.unlinkSync(file.path);
        }
        review.photo=photo
        await review.save()
      }
      res.json(review)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
    // if (!req.files || req.files.length === 0) {
    //   return res.status(400).json({ error: 'No files uploaded' });
    // }

    // const uploadPromises = req.files.map(async (file) => {
    //   const result = await cloudinary.uploader.upload(file.path, {
    //     folder: 'review_images', // Organize images in a folder
    //   });

    //   // Delete the temporary file after uploading to Cloudinary
    //   try {
    //     fs.unlinkSync(file.path);
    //   } catch (unlinkErr) {
    //     console.error('Error deleting temp file:', unlinkErr);
    //   }

    //   return { url: result.secure_url, public_id: result.public_id };
    // });

    // const photos = await Promise.all(uploadPromises);

    // res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while uploading' });
  }
};

// reviewCtrl.createAndUpload = async (req, res) => {
//   try {
//     const { reviewFor, reviewEntityId, reviewText, rating } = req.body;
//     console.log('Request Body:', req.body);
//     console.log('Request Files:', req.files);

//     if (reviewFor !== 'Book') {
//       return res.status(400).json({ error: 'Invalid review target' });
//     }

//     const user = await User.findById(req.currentUser.userId);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     if (user.role !== 'client') {
//       return res.status(403).json({ error: 'Only clients can review books' });
//     }

//     const client = await Client.findOne({ client: user._id }).populate(
//       'rentedBooks.book purchasedBooks.book'
//     );
//     if (!client) {
//       return res.status(404).json({ error: 'Client not found' });
//     }

//     const hasRentedBook = client?.rentedBooks?.some(
//       (ele) => ele.book?._id.toString() === reviewEntityId
//     );
//     const hasPurchasedBook = client.purchasedBooks?.some(
//       (ele) => ele.book?._id.toString() === reviewEntityId
//     );

//     if (!hasRentedBook && !hasPurchasedBook) {
//       return res.status(403).json({
//         error: 'You must rent or purchase the book to review it',
//       });
//     }

//     let review = await Review.findOne({
//       reviewBy: user._id,
//       reviewEntityId,
//     });

//     if (!review) {
//       review = new Review({
//         reviewFor,
//         reviewEntityId,
//         reviewBy: user._id,
//         reviewText,
//         rating,
//         reviewedAt: Date.now(),
//         photo: [],
//       });
//       await review.save();
//     }

//     if (req.files && req.files.length > 0) {
//       const photo = [];
//       for (const file of req.files) {
//         const result = await cloudinary.uploader.upload(file.path, {
//           folder: 'review_images',
//         });
//         photo.push({ url: result.secure_url, public_id: result.public_id });
//         fs.unlinkSync(file.path);
//       }
//       review.photo = photo;
//       await review.save();
//     }

//     const book = await Book.findById(reviewEntityId);
//     if (!book) {
//       return res.status(404).json({ error: 'Book not found' });
//     }

//     const reviews = await Review.find({ reviewEntityId: book._id });
//     const total = reviews.reduce((acc, cv) => acc + cv.rating, 0);
//     const average = total / reviews.length;

//     await Book.findByIdAndUpdate(
//       reviewEntityId,
//       {
//         $push: { reviews: review._id },
//         $set: { totalRating: average },
//       },
//       { new: true }
//     );

//     res.status(201).json({ review, average });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// };


reviewCtrl.getBook=async(req,res)=>{
    try{
        const {bid}=req.params
        console.log('bid',bid)
        const reviews=await Review.find({reviewEntityId:bid}).populate('reviewBy')
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

