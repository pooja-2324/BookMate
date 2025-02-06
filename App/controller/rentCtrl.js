import Book from "../models/book-model.js";
import Rent from "../models/rental-model.js";
import Client from "../models/client-model.js";
import Vendor from "../models/vendor-model.js";
import Cart from "../models/cart-model.js";

const rentCtrl={}
rentCtrl.details=async(req,res)=>{
    try{
        const body=req.body
        const {bid}=req.params
        body.vendor=req.currentUser.userId
        body.rentalStartDate=new Date()
        const book=await Book.findById(bid)
        if(!book){
            return res.status(404).json({error:'book not found'})
        }
        if(book.vendor!=body.vendor){
            return res.status(400).json({error:'you are not authorized to create the rental details of this book'})
        }
        let rentalStartDate =new Date (body.rentalStartDate.toISOString().split('T')[0]);
        console.log('startdate',rentalStartDate)
        if (isNaN(rentalStartDate.getTime())) {
          return res.status(400).json({ error: "Invalid rentalStartDate" });
        }
    
        // Calculate rentalEndDate
        const period = body.period;
        console.log('period',period) // Period in days
        if (isNaN(period) || period <= 0) {
          return res.status(400).json({ error: "Invalid rental period" });
        }
        const rentalEndDate = new Date(rentalStartDate); // Clone the start date
        rentalEndDate.setUTCDate(rentalEndDate.getUTCDate() + period); // Add the period
        console.log('end',rentalEndDate)
    
        // Create the rental entry
        body.pricing.readingFee=book.rentPrice
        body.rentalStartDate = rentalStartDate;
        body.rentalEndDate = rentalEndDate;
        const rent=new Rent(body)
        rent.book=bid

        await rent.save()
        res.status(201).json(rent)

    }catch(err){
      console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
rentCtrl.active=async(req,res)=>{
  try{
    const activeRents=await Rent.find({rentedBookStatus:'active',vendor:req.currentUser.userId})
      if(!activeRents){
        return res.status(404).json({error:'rent not found'})
      }
      res.json(activeRents)
    
  }catch(err){
    console.log(err)
    res.status(500).json({error:'something went wrong'})
  }
}
rentCtrl.rentDetails=async(req,res)=>{
  try{
    const {bid}=req.params
    const rent=await Rent.findOne({book:bid})
    if(!rent){
      return res.status(404).json({error:'rent not found'})
    }
    res.json([rent])
  }catch(err){
    console.log(err)
    res.status(500).json({error:err})
  }
}




// Place Order for All Books in the Cart
rentCtrl.placeOrder = async (req, res) => {
  try {
    const clientId = req.currentUser.userId;

    // Find all cart items for the client
    const cartItems = await Cart.find({ client: clientId }).populate("book").populate("rent");

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Your cart is empty." });
    }

    const orders = [];

    for (const item of cartItems) {
      const { book, rent } = item;

      if (!rent || rent.rentedBookStatus === "active") {
        return res.status(400).json({ error: `Order already placed for book ${book.modifiedTitle}` });
      }

      // Set rental start date and due date
      const rentalStartDate = new Date();
      const dueDate = new Date(rentalStartDate);
      dueDate.setDate(rentalStartDate.getDate() + rent.period);

      // Update Rent details
      await Rent.findByIdAndUpdate(rent._id, {
        client: clientId,
        rentalStartDate,
        dueDate,
        rentedBookStatus: "active",
        deliveryStatus: "order placed"
      });

      // Update Book details: Set status to 'notAvailable' and increment rentCount
      await Book.findByIdAndUpdate(
        book._id,
        {
          $set: { status: "notAvailable" },
          $inc: { rentCount: 1 }
        },
        { new: true }
      );

      // Update Client details
      await Client.findOneAndUpdate(
        { client: clientId },
        {
          $push: {
            rentedBooks: {
              $each: [
                {
                  book: book._id,
                  rent: rent._id
                }
              ],
              $position: 0 // Insert at the beginning of the array
            }
          }
        }
      );

      // Update Vendor earnings
      // await Vendor.findOneAndUpdate(
      //   { _id: book.vendor },
      //   {
      //     $push: {
      //       totalEarnings: {
      //         book: book._id,
      //         earnings: rent.pricing.readingFee
      //       }
      //     }
      //   }
      // );
      const vendor = await Vendor.findById(book.vendor);
      const existingEarnings = vendor.totalEarnings.find(te => te.book.toString() === book._id.toString());

if (existingEarnings) {
    // If the book exists, increment its earnings
    await Vendor.findOneAndUpdate(
        { _id: book.vendor, "totalEarnings.book": book._id },
        { $inc: { "totalEarnings.$.earnings": rent.pricing.readingFee } },
        { new: true }
    );
} else {
    // If the book doesn't exist in earnings, push a new entry
    await Vendor.findByIdAndUpdate(
        book.vendor,
        {
            $push: {
                totalEarnings: {
                    book: book._id,
                    earnings: rent.pricing.readingFee
                }
            }
        },
        { new: true }
    );
}

      orders.push({
        book: book.title,
        rentalStartDate,
        dueDate,
        pricing: rent.pricing
      });
    }

    // Clear cart after placing order
    await Cart.deleteMany({ client: clientId });

    res.json({ message: "Order placed successfully", orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};




// rentCtrl.placeOrder = async (req, res) => {
//   try {
    
//     const rent = await Rent.findById(rid);
//     if (!rent) {
//       return res.status(404).json({ error: 'Rent details not found' });
//     }
//     if (rent.rentedBookStatus === 'active') {
//       return res.status(400).json({ error: 'Order already placed' });
//     }

//     const rentalStartDate = new Date();
//     let dueDate = new Date(rentalStartDate);
//     dueDate = dueDate.setDate(rentalStartDate.getDate() + rent.period);

//     // Update Rent details
//     await Rent.findByIdAndUpdate(rid, {
//       client: req.currentUser.userId,
//       rentalStartDate,
//       dueDate,
//       rentedBookStatus: 'active',
//       deliveryStatus:'order placed'
//     });

//     // Update Book details: Set status to 'notAvailable' and increment rentCount
//     await Book.findByIdAndUpdate(
//       rent.book,
//       {
//         $set: { status: 'notAvailable' },
//         $inc: { rentCount: 1 }, // Increment rentCount
//       },
//       { new: true } // Return the updated document
//     );

//     // Update Client details
//     const clientId = req.currentUser.userId;
//     await Client.findOneAndUpdate(
//       { client: clientId },
//       {
//         $push: {
//           rentedBooks: {
//             book: rent.book,
//             rentDetails: rent._id,
//           },
//         },
//       }
//     );

//     // Update Vendor earnings
//     await Vendor.findOneAndUpdate(
//       { vendor: rent.vendor },
//       {
//         $push: {
//           totalEarnings: {
//             book: rent.book._id,
//             earnings: rent.pricing.readingFee,
//           },
//         },
//       }
//     );

//     res.json({ message: 'Order placed successfully' });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// };

rentCtrl.return=async(req,res)=>{
    try{
        const {bid} =req.params
        
        const rent=await Rent.findOne({book:bid})
        if(!rent){
            return res.status(404).json({error:'rent details not found'})
        }
        const returnDate = new Date();
        console.log('returndate',new Date())
        console.log('rd dd',returnDate,rent.dueDate)
        console.log('sub',returnDate - rent.dueDate)
        const lateFee = rent.dueDate < returnDate ? (returnDate - rent.dueDate) / (1000 * 60 * 60 * 24) * 10 : 0; // Calculate late fee for each day over due date
        const damageFee = rent.isDamaged ? 30 : 0
        await Rent.findByIdAndUpdate(rent._id,{
            rentedBookStatus:'completed',
            returnedDate:new Date(),
            lateFee,
            damageFee
        })
        await Book.findByIdAndUpdate(rent.book, { status: 'available' });
        const additionalEarnings = rent.pricing.readingFee + lateFee + damageFee;
    const vendor = await Vendor.findOne({ vendor: rent.vendor });

    const bookEarningIndex = vendor.totalEarnings.findIndex(
      (entry) => entry.book?.toString() === rent.book?.toString()
    );

    if (bookEarningIndex > -1) {
      // Update earnings for the specific book
      vendor.totalEarnings[bookEarningIndex].earnings += additionalEarnings;
    } else {
      // Add a new entry for this book if it doesn't exist
      vendor.totalEarnings.push({
        book: rent.book,
        earnings: additionalEarnings,
      });
    }
        res.json({message:'book returned successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
// rentCtrl.earnings = async (req, res) => {
//     try {
//       const vendor = req.currentUser.userId;
  
//       // Get all rents for the vendor
//       const rents = await Rent.find({ vendor }).populate("book","vendor");
  
//       if (!rents || rents.length === 0) {
//         return res.status(404).json({ error: "No rental data found." });
//       }
  
//       // Create a map to store book earnings and rent counts
//       const bookStats = {};
  
//       rents.forEach((rent) => {
//         const bookId = rent.book._id.toString();
  
//         if (!bookStats[bookId]) {
//           bookStats[bookId] = {
//             book: rent.book,
//             totalEarnings: 0,
//             rentCount: 0,
//           };
//         }
        
  
//         const readingFee = rent.pricing?.readingFee || 0;
//         const lateFee = rent.lateFee || 0;
//         const damageFee = rent.damageFee || 0;
  
//         // Update earnings and rent count
//         bookStats[bookId].totalEarnings += readingFee + lateFee + damageFee;
//         bookStats[bookId].rentCount += 1;
//       });
  
//       // Convert bookStats to an array
//       const earningsData = Object.values(bookStats);
  
//       res.json(earningsData);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ error: "Something went wrong" });
//     }
//   };

rentCtrl.earnings = async (req, res) => {
    try {
      const vendor = req.currentUser.userId;
  
      // Get all rents for the vendor
      const rents = await Rent.find({ vendor }).populate("book", "vendor");
  
      if (!rents || rents.length === 0) {
        return res.status(404).json({ error: "No rental data found." });
      }
  
      // Retrieve vendor's existing earnings
      const vendorData = await Vendor.findById(vendor);
      const vendorEarnings = vendorData?.totalEarnings || [];
  
      // Create a map for vendor's books with their current earnings
      const bookStats = {};
  
      // Populate bookStats with vendor's existing earnings
      vendorEarnings.forEach((bookEarnings) => {
        bookStats[bookEarnings.book.toString()] = {
          totalEarnings: bookEarnings.earnings,
          rentCount: 0,
        };
      });
  
      // Update bookStats with rent data
      rents.forEach((rent) => {
        const bookId = rent.book._id.toString();
  
        if (!bookStats[bookId]) {
          bookStats[bookId] = {
            totalEarnings: 0,  // Initialize totalEarnings for new books
            rentCount: 0,
          };
        }
  
        const readingFee = rent.pricing?.readingFee || 0;
        const lateFee = rent.lateFee || 0;
        const damageFee = rent.damageFee || 0;
  
        // Accumulate earnings and rent count for the book
        bookStats[bookId].totalEarnings += readingFee + lateFee + damageFee;
        bookStats[bookId].rentCount += 1;
      });
  
      // Convert bookStats to an array and send the response
      const earningsData = Object.keys(bookStats).map((bookId) => {
        return {
          book: { _id: bookId },  // Assuming we need to include book's id
          totalEarnings: bookStats[bookId].totalEarnings,
          rentCount: bookStats[bookId].rentCount,
        };
      });
  
      res.json(earningsData);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    }
  };
rentCtrl.update=async(req,res)=>{
  try{
    const {id}=req.params
    const body=req.body
    const vendor=req.currentUser.userId
    const rent = await Rent.findOne({ vendor, _id: id });
    if (!rent) {
      return res.status(404).json({ error: 'Rent not found' });
    }
    if(body.period){
      const rentalStartDate=new Date(rent.rentalStartDate)
      const period=body.period
      if(period<=0){
        return res.status(400).json({error:'invalid period'})
      }
      const rentalEndDate=new Date(rentalStartDate)
      console.log('red',rentalEndDate.getUTCDate()+period)
      rentalEndDate.setUTCDate(rentalEndDate.getUTCDate()+period)
      body.rentalEndDate=rentalEndDate
    }
    const rents=await Rent.findOneAndUpdate({vendor,_id:id},body,{runValidators:true,new:true})
    if(!rents){
      return res.status(404).json({error:'rent not found'})
    }
    res.json([rents])
  }catch(err){
    console.log(err)
    res.status(500).json({error:'something went wrong'})
  }
}
export default rentCtrl