import Book from "../models/book-model.js";
import Rent from "../models/rental-model.js";
import Client from "../models/client-model.js";
import Vendor from "../models/vendor-model.js";
import Cart from "../models/cart-model.js";
import Buy from '../models/selling-model.js'
import Order from "../models/order-model.js";

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
    const activeRents=await Rent.find({rentedBookStatus:'active',vendor:req.currentUser.userId}).populate('book')
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
// rentCtrl.bothPlaceOrder = async (req, res) => {
//   try {
//     const clientId = req.currentUser.userId;

//     // Find all cart items for the client
//     const cartItems = await Cart.find({ client: clientId }).populate("book").populate("rent").populate('buy');

//     if (cartItems.length === 0) {
//       return res.status(400).json({ error: "Your cart is empty." });
//     }

//     const orders = [];

//     for (const item of cartItems) {
//       const { book, rent ,buy} = item;
//       if(book.status=='notAvailable'||book.status=='withdrawn'){
//         return res.status(404).json({error:`Book ${book.modifiedTitle} is not available`})
//       }

//       if (!rent || rent.rentedBookStatus === "active") {
//         return res.status(400).json({ error: `Order already placed for book ${book.modifiedTitle}` });
//       }

//       // Set rental start date and due date
//       const rentalStartDate = new Date();
//       const dueDate = new Date(rentalStartDate);
//       dueDate.setDate(rentalStartDate.getDate() + rent.period);

//       // Update Rent details
//       await Rent.findByIdAndUpdate(rent._id, {
//         client: clientId,
//         rentalStartDate,
//         dueDate,
//         rentedBookStatus: "active",
//         deliveryStatus: "order placed"
//       });

//       // Update Book details: Set status to 'notAvailable' and increment rentCount
//       await Book.findByIdAndUpdate(
//         book._id,
//         {
//           $set: { status: "notAvailable" },
//           $inc: { rentCount: 1 }
//         },
//         { new: true }
//       );

//       // Update Client details
//       await Client.findOneAndUpdate(
//         { client: clientId },
//         {
//           $push: {
//             rentedBooks: {
//               $each: [
//                 {
//                   book: book._id,
//                   rent: rent._id
//                 }
//               ],
//               $position: 0 // Insert at the beginning of the array
//             }
//           }
//         }
//       );

      
// const vendor = await Vendor.findOne({ vendor: book.vendor });

// if (!vendor) {
//   console.log("Vendor not found for book:", book._id);
//   continue; // Skip this iteration if vendor not found
// }

// // Check if the book already exists in `totalEarnings`
// const existingEarningsIndex = vendor.totalEarnings?.findIndex(
//   (entry) => entry.book.toString() === book._id.toString()
// );

// if (existingEarningsIndex > -1) {
//   console.log("Updating existing earnings for book:", book._id);
  
//   // If book exists, increment earnings
//   await Vendor.findOneAndUpdate(
//     { _id: vendor._id, "totalEarnings.book": book._id },
//     { $inc: { "totalEarnings.$.earnings": rent.pricing.readingFee } },
//     { new: true }
//   );
// } else {
//   console.log("Adding new earnings entry for book:", book._id);
  
//   // If the book doesn't exist in `totalEarnings`, push a new entry
//   await Vendor.findByIdAndUpdate(
//     vendor._id,
//     {
//       $push: {
//         totalEarnings: {
//           book: book._id,
//           earnings: rent.pricing.readingFee
//         }
//       }
//     },
//     { new: true }
//   );
// }



//       orders.push({
//         type:'rent',
//         book: book.title,
//         rentalStartDate,
//         dueDate,
//         pricing: rent.pricing
//       });
//     }
//     if(buy){
//       await Buy.findByIdAndUpdate(buy._id,{
//         client:clientId,
//         deliveryStatus:'orderPlaced'
//       })
//       await Book.findByIdAndUpdate(book._id,{status:'notAvailable'})
//       await Client.findOneAndUpdate(
//         { _id: clientId },
//         {
//           $push: {
//             purchasedBooks: {
//               book: book._id,
//               buyingDetails: buy._id
//             }
//           }
//         }
//       );
//       const vendor = await Vendor.findOne({ _id: book.vendor });
//       if (vendor) {
//         const existingEarningsIndex = vendor.totalEarnings?.findIndex(
//           (entry) => entry.book.toString() === book._id.toString()
//         );

//         if (existingEarningsIndex > -1) {
//           await Vendor.findOneAndUpdate(
//             { _id: vendor._id, "totalEarnings.book": book._id },
//             { $inc: { "totalEarnings.$.earnings": buy.sellPrice } },
//             { new: true }
//           );
//         } else {
//           await Vendor.findByIdAndUpdate(
//             vendor._id,
//             {
//               $push: {
//                 totalEarnings: {
//                   book: book._id,
//                   earnings: buy.sellPrice
//                 }
//               }
//             },
//             { new: true }
//           );
//         }
//       }
//       orders.push({
//         type: "buy",
//         book: book.title,
//         pricing: { sellPrice: buy.sellPrice }
//       });
    
//     }
//     // Clear cart after placing order
//     await Cart.deleteMany({ client: clientId });

//     res.json({ message: "Order placed successfully", orders });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Something went wrong",err });
//   }
// };
rentCtrl.bothPlaceOrder = async (req, res) => {
  try {
    const clientId = req.currentUser.userId;

    // Find all cart items for the client
    const cartItems = await Cart.find({ client: clientId }).populate("book").populate("rent").populate("buy");

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Your cart is empty." });
    }

    const orders = [];

    for (const item of cartItems) {
      const { book, rent, buy } = item;

      if (book.status === 'notAvailable' || book.status === 'withdrawn') {
        return res.status(404).json({ error: `Book ${book.modifiedTitle} is not available` });
      }

      // Processing Rent Order
      if (rent) {
        if (rent.rentedBookStatus === "active") {
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
        const updateRentBook=await Book.findByIdAndUpdate(
          book._id,
          {
            $set: { status: "notAvailable" },
            $inc: { rentCount: 1 }
          },
          { new: true }
        );
        console.log('update rentbook',updateRentBook)

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
          },
          {new:true}
        );

        const vendor = await Vendor.findOne({ vendor: book.vendor });

        if (vendor) {
          // Check if the book already exists in `totalEarnings`
          const existingEarningsIndex = vendor.totalEarnings?.findIndex(
            (entry) => entry.book.toString() === book._id.toString()
          );

          if (existingEarningsIndex > -1) {
            // If book exists, increment earnings
            await Vendor.findOneAndUpdate(
              { _id: vendor._id, "totalEarnings.book": book._id },
              { $inc: { "totalEarnings.$.earnings": rent.pricing.readingFee } },
              { new: true }
            );
          } else {
            // If the book doesn't exist in `totalEarnings`, push a new entry
            await Vendor.findByIdAndUpdate(
              vendor._id,
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
        }
        await Order.create({
          vendor: book.vendor,
          book: book._id,
          rent: rent._id,
          client: clientId
        });
        orders.push({
          type: 'rent',
          book: book.title,
          rentalStartDate,
          dueDate,
          pricing: rent.pricing
        });
      }

      // Processing Buy Order
      if (buy) {
        await Buy.findByIdAndUpdate(buy._id, {
          client: clientId,
          deliveryStatus: 'orderPlaced'
        });

        const updateBuyBook=await Book.findByIdAndUpdate(book._id, { status: 'notAvailable' });
        console.log('update buyBook',updateBuyBook)

        await Client.findOneAndUpdate(
          { client: clientId },
          {
            $push: {
              purchasedBooks: {
                $each: [
                  {
                    book: book._id,
                    buyingDetails: buy._id
                  }
                ],
                $position: 0 // Insert at the beginning of the array
              }
            }
          },
          {new:true}
        );

        const vendor = await Vendor.findOne({ vendor: book.vendor });
        if (vendor) {
          const existingEarningsIndex = vendor.totalEarnings?.findIndex(
            (entry) => entry.book.toString() === book._id.toString()
          );

          if (existingEarningsIndex > -1) {
           const buyVendor1= await Vendor.findOneAndUpdate(
              { _id: vendor._id, "totalEarnings.book": book._id },
              { $inc: { "totalEarnings.$.earnings": buy.sellPrice } },
              {upsert:true,new: true }
            );
            console.log('buy vendor1',buyVendor1)
          } else {
           const buyVendor= await Vendor.findByIdAndUpdate(
              vendor._id,
              {
                $push: {
                  totalEarnings: {
                    book: book._id,
                    earnings: buy.sellPrice
                  }
                }
              },
              { new: true }
            );
            console.log('buy vendor',buyVendor)
          }
        }
        await Order.create({
          vendor: book.vendor,
          book: book._id,
          buy: buy._id,
          client: clientId
        });
        orders.push({
          type: "buy",
          book: book.title,
          pricing: { sellPrice: buy.sellPrice }
        });
      }
    }

    // Clear cart after placing order
    await Cart.deleteMany({ client: clientId });

    res.json({ message: "Order placed successfully", orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong", err });
  }
};






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
rentCtrl.placeSingleOrder = async (req,res) => {
  const {bid}=req.params
  const client=req.currentUser.userId
  const book = await Book.findById(bid);
  const rent = await Rent.findOne({book:bid});
try{
  if (!book || !rent) {
    return res.status(404).json("Book or Rent details not found.");
  }

  if (rent.rentedBookStatus === "active") {
    return res.status(400).json(`Order already placed for book ${book.modifiedTitle}`);
  }

  // Set rental start date and due date
  const rentalStartDate = new Date();
  const dueDate = new Date(rentalStartDate);
  dueDate.setDate(rentalStartDate.getDate() + rent.period);

  // Update Rent details
  await Rent.findByIdAndUpdate(rent._id, {
    client,
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
    { _id: client },
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
    },{new:true}
  );

  // Update Vendor details
  const vendor = await Vendor.findOne({ vendor: book.vendor });

  if (!vendor) {
    console.log("Vendor not found for book:", book._id);
    return;
  }

  // Check if the book already exists in `totalEarnings`
  const existingEarningsIndex = vendor.totalEarnings?.findIndex(
    (entry) => entry.book.toString() === book._id.toString()
  );

  if (existingEarningsIndex > -1) {
    console.log("Updating existing earnings for book:", book._id);

    // If book exists, increment earnings
    await Vendor.findOneAndUpdate(
      { _id: vendor._id, "totalEarnings.book": book._id },
      { $inc: { "totalEarnings.$.earnings": rent.pricing.readingFee } },
      { new: true }
    );
  } else {
    console.log("Adding new earnings entry for book:", book._id);

    // If the book doesn't exist in `totalEarnings`, push a new entry
    await Vendor.findByIdAndUpdate(
      vendor._id,
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
  res.json({
    book,
    rent,
    dueDate,
    pricing: rent.pricing
  })
}catch(err){
  console.log(err)
  res.status(500).json({error:'something went wrong'})
}
  
};
export default rentCtrl