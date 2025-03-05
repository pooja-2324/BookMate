import Vendor from "../models/vendor-model.js";
import User from "../models/user-model.js";
import Stripe from 'stripe'
import Rent from "../models/rental-model.js";
import Payment from "../models/payment-model.js";
import Client from "../models/client-model.js"
import Book from '../models/book-model.js'
const vendorCtrl = {}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

vendorCtrl.allVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' })
    res.json(vendors)
  } catch (err) {
    res.status(500).json({ error: 'something went wrong' })
  }
}
vendorCtrl.verified = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isApproved: true }).populate('vendor')
    if (!vendors) {
      return res.status(400).json({ error: 'vendors not found' })
    }
    res.json(vendors)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'something went wrong in verified vendors' })
  }
}
vendorCtrl.blocked = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isApproved: false }).populate('vendor')
    if (!vendors) {
      return res.status(400).json({ error: 'vendors not found' })
    }
    res.json(vendors)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'something went wrong in blocked vendors' })
  }
}
vendorCtrl.updateVerification=async(req,res)=>{
  try{
    const {vid}=req.params
    const body=req.body
    const vendor=await Vendor.findByIdAndUpdate({_id:vid},body,{new:true})
    if(!vendor){
      return res.status(400).json({error:'something went wrong'})
    }
    res.json(vendor)
  }catch(err){
    console.log(err)
    res.status(500).json({error:'something went wrong'})
  }
}
vendorCtrl.oneVendor = async (req, res) => {
  try {
    const id = req.params.id
    const vendor = await User.findById(id)
    if (!vendor) {
      return res.status(404).json({ error: 'vendor not found' })
    }
    res.json(vendor)
  } catch (err) {
    res.status(500).json({ error: 'something went wrong' })
  }
}

// vendorCtrl.earnings = async (req, res) => {
//     try {
//       const vendorId = req.currentUser.userId;

//       // Fetch vendor details. Use findOne since you're looking for a single vendor
//       const vendor = await Vendor.findOne({ vendor: vendorId }).populate('totalEarnings.book');

//       if (!vendor) {
//         return res.status(404).json({ error: 'Vendor not found' });
//       }

//       // Initialize bookEarning object to store book earnings and rent count
//       const bookEarning = {};

//       // If totalEarnings exists and has data
//       if (vendor.totalEarnings && vendor.totalEarnings.length > 0) {
//         // Map over totalEarnings and accumulate earnings for each book
//         vendor.totalEarnings.forEach((ele) => {
//           const bookId = ele.book.toString();

//           // If the book already exists in bookEarning, add to the existing earnings and increment rent count
//           if (bookEarning[bookId]) {
//             bookEarning[bookId].earnings += ele.earnings;
//             bookEarning[bookId].rentCount += 1;
//           } else {
//             // Otherwise, initialize earnings and rent count for the book
//             bookEarning[bookId] = {
//               earnings: ele.earnings,
//               rentCount: 1,
//               book:ele.book
//             };
//           }
//         });
//       }

//       // Now `bookEarning` holds the book id as key and total accumulated earnings and rent count as value
//       res.json(bookEarning);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Something went wrong" });
//     }
//};
// vendorCtrl.earnings = async (req, res) => {
//   try {
//     const vendorId = req.currentUser.userId;

//     // Fetch vendor details. Use findOne since you're looking for a single vendor
//     const vendor = await Vendor.findOne({ vendor: vendorId })
//       .populate('totalEarnings.book');  // Populate the book field inside totalEarnings array

//     if (!vendor) {
//       return res.status(404).json({ error: 'Vendor not found' });
//     }

//     // Initialize bookEarning object to store book earnings and rent count
//     const bookEarning = {};

//     // If totalEarnings exists and has data
//     if (vendor.totalEarnings && vendor.totalEarnings.length > 0) {
//       // Map over totalEarnings and accumulate earnings for each book
//       vendor.totalEarnings.forEach((ele) => {
//         if (!ele.book) {
//         return;
//       }
//         const bookId = ele.book?._id.toString();  // Use the populated book field

//         // If the book already exists in bookEarning, add to the existing earnings and increment rent count
//         if (bookEarning[bookId]) {
//           bookEarning[bookId].earnings += ele.earnings;
//           bookEarning[bookId].rentCount += 1;
//         } else {
//           // Otherwise, initialize earnings and rent count for the book
//           bookEarning[bookId] = {
//             earnings: ele.earnings,
//             rentCount: 1,
//             book: ele.book  // Store the book object as part of the value
//           };
//         }
//       });
//     }

//     // Now `bookEarning` holds the book id as key and total accumulated earnings and rent count as value
//     res.json(bookEarning);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };
vendorCtrl.earnings = async (req, res) => {
  try {
    const vendorId = req.currentUser.userId;

    // Fetch vendor details and populate totalEarnings with book information
    const vendor = await Vendor.findOne({ vendor: vendorId })
      .populate('totalEarnings.book'); // Populate the book field inside totalEarnings array

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Use a Map to aggregate earnings and rent count by book
    const bookEarningsMap = new Map();

    // Loop through the current totalEarnings
    vendor.totalEarnings.forEach((entry) => {
      const bookId = entry.book?._id.toString();
      console.log('bookId', [bookId]) // Get the book ID

      if (!bookId) return; // Skip if the book ID is missing

      if (bookEarningsMap.has(bookId)) {
        // If the book already exists in the Map, update its earnings and increment rent count
        const existing = bookEarningsMap.get(bookId);
        bookEarningsMap.set(bookId, {
          ...existing,
          earnings: existing.earnings + entry.earnings,
          // Increment the rent count
        });
      } else {
        // If the book is not in the Map, initialize it with earnings and a rent count of 1
        // bookEarningsMap.set(bookId, {
        //   book: entry.book,
        //   earnings: entry.earnings,
        //   rentCount: 1, // Initialize rent count
        // });


        bookEarningsMap.set(bookId, {
          book: entry.book,
          earnings: entry.earnings,
          // Add to the existing rent count
        });
      }
    });

    // Convert the Map back to an array for saving
    const updatedEarnings = [];
    bookEarningsMap.forEach((value) => updatedEarnings.push(value));

    // Replace the vendor's totalEarnings array with the updated data
    vendor.totalEarnings = updatedEarnings;

    // Save the updated vendor document
    await vendor.save();

    // Respond with the updated earnings
    res.status(200).json(
      updatedEarnings,
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// vendorCtrl.acceptReturn = async (req, res) => {
//   try {
//     const { rid } = req.body;
//     const rent = await Rent.findById(rid).populate('book').populate('client').populate('vendor');

//     if (!rent) {
//       return res.status(400).json({ error: 'Rent not found' });
//     }

//     const cautionDeposit = rent.pricing.cautionDeposit;
//     const readingFee = rent.pricing.readingFee;
//     const platformFee = rent.pricing.platformFee;
//     const deliveryFee = rent.pricing.deliveryFee;
//     const returnDate = new Date();
//     const lateFee = rent.dueDate < returnDate ? (returnDate - rent.dueDate) / (1000 * 60 * 60 * 24) * 10 : 0; // Calculate late fee for each day over due date

//     const totalClientRefund = cautionDeposit - rent.damageFee;
//     const totalVendorEarnings = rent.damageFee + lateFee * 0.5;

//     // Update client's balance
//     await Client.findByIdAndUpdate(rent.client._id, {
//       $inc: { refund: totalClientRefund }

//     });

//     // Update vendor's balance
//     const vendor = await Vendor.findOne({ vendor: rent.vendor._id });

//     if (vendor) {
//       const existingEarningsIndex = vendor.totalEarnings?.findIndex(
//         (entry) => entry.book.toString() === rent.book._id.toString()
//       );

//       if (existingEarningsIndex > -1) {
//         await Vendor.findOneAndUpdate(
//           { _id: vendor._id, "totalEarnings.book": rent.book._id },
//           { $inc: { "totalEarnings.$.earnings": totalVendorEarnings } }
//         );
//       } else {
//         await Vendor.findByIdAndUpdate(
//           vendor._id,
//           {
//             $push: {
//               totalEarnings: {
//                 book: rent.book._id,
//                 earnings: totalVendorEarnings
//               }
//             }
//           }
//         );
//       }
//     }

//     // Update book status
//     await Book.findByIdAndUpdate(rent.book._id, {
//       status: "available"
//     }, { new: true });

//     // Update rent status
//     await Rent.findByIdAndUpdate(rid, {
//       rentedBookStatus: "completed",
//       returnedDate: new Date()
//     }, { new: true });

//     // Create a payment record for the transaction
//     const vendorPayment = new Payment({
//       rentId: rid,
//       clientId: rent.client._id,
//       vendorId: rent.vendor._id,
//       amount: totalVendorEarnings,
//       paymentReason: 'returnAccept',
//       paymentStatus: 'success'
//     });

//     await vendorPayment.save();

//     const clientPayment = new Payment({
//       rentId: rid,
//       clientId: rent.client._id,
//       vendorId: rent.vendor._id,
//       amount: totalClientRefund,
//       paymentReason: 'refund',
//       paymentStatus: 'success',
//       paymentType: 'debit' // Indicates this is a refund to the client
//     });

//     await clientPayment.save();

//     res.json({ message: "Return accepted successfully", vendorPayment, clientPayment });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// };
// Replace with your Stripe secret key

vendorCtrl.acceptReturn = async (req, res) => {
  try {
    const { rid } = req.body;

    // Simulate account activation for the vendor in test mode
    const vendorAccountId = 'acct_1QxqRII0GCgMrAo7'; // Replace with the vendor's test account ID


    const rent = await Rent.findById(rid)
      .populate('book')
      .populate('client')
      .populate('vendor');

    if (!rent) {
      return res.status(400).json({ error: 'Rent not found' });
    }

    const cautionDeposit = rent.pricing.cautionDeposit;
    const readingFee = rent.pricing.readingFee;
    const platformFee = rent.pricing.platformFee;
    const deliveryFee = rent.pricing.deliveryFee;
    const returnDate = new Date();
    const lateFee =
      rent.dueDate < returnDate
        ? ((returnDate - rent.dueDate) / (1000 * 60 * 60 * 24)) * 10
        : 0; // Calculate late fee for each day over due date

    const totalClientRefund = cautionDeposit - rent.damageFee;
    const totalVendorEarnings = rent.pricing.readingFee + rent.damageFee + (lateFee * 0.5);
    console.log('crefund', totalClientRefund, 'vearnings', totalVendorEarnings);

    const client = await Client.findOne({ client: rent.client._id });
    console.log('rent', rent);

    if (!client || !client.paymentIntent) {
      return res.status(400).json({ error: 'Client or payment intent ID is missing' });
    }

    if (totalClientRefund <= 0) {
      return res.status(400).json({ error: 'Invalid refund amount' });
    }

    // Validate amounts before Stripe API calls
    const refundAmountInCents = Math.round(totalClientRefund * 100);
    const vendorEarningsInCents = Math.round(totalVendorEarnings * 100);

    console.log('refund', refundAmountInCents, 'earnings', vendorEarningsInCents);

    if (refundAmountInCents < 1 || vendorEarningsInCents < 1) {
      return res.status(400).json({ error: 'Amount must be at least 0.01 USD' });
    }

    // Update client's balance
    await Client.findByIdAndUpdate(rent.client._id, {
      $inc: { refund: totalClientRefund },
    });

    // Update vendor's balance
    const vendor = await Vendor.findOne({ vendor: rent.vendor._id });

    if (vendor) {
      const existingEarningsIndex = vendor.totalEarnings?.findIndex(
        (entry) => entry.book.toString() === rent.book._id.toString()
      );

      if (existingEarningsIndex > -1) {
        await Vendor.findOneAndUpdate(
          { _id: vendor._id, 'totalEarnings.book': rent.book._id },
          { $inc: { 'totalEarnings.$.earnings': totalVendorEarnings } }
        );
      } else {
        await Vendor.findByIdAndUpdate(vendor._id, {
          $push: {
            totalEarnings: {
              book: rent.book._id,
              earnings: totalVendorEarnings,
            },
          },
        });
      }
    }

    // Update book status
    // await Book.findByIdAndUpdate(
    //   rent.book._id,
    //   {
    //     status: 'available',
    //   },
    //   { new: true }
    // );

    // // Update rent status
    // await Rent.findByIdAndUpdate(
    //   rid,
    //   {
    //     rentedBookStatus: 'completed',
    //     returnedDate: new Date(),
    //   },
    //   { new: true }
    // );

    // Refund to Client
    const refund = await stripe.transfers.create({
      amount: 1,
      currency: 'usd',
      destination: "cus_RslJUmJkEmGbMv", // Replace with the client's Stripe account ID
      description: 'Refund for caution deposit',
    });

    console.log("refund ======", refund)

    const paymentIntent = await stripe.paymentIntents.retrieve(client.paymentIntent);
    console.log('Original Amount:', paymentIntent.amount);
    console.log('Refunded Amount:', paymentIntent.amount_refunded);
    console.log('Unrefunded Amount:', paymentIntent.amount - paymentIntent.amount_refunded);

    // Transfer to Vendor's Connected Account
    // const vendorTransfer = await stripe.payouts.create({
    //   amount: 14908, // Amount in cents
    //   currency: 'usd', // Replace with your currency
    //   destination:"acct_1QxqRII0GCgMrAo7",// Vendor's connected account ID
    //   description: `Earnings from book rental (Rent ID: ${rid})`,
    // });

    // const topUp = await stripe.topups.create({
    //   amount: 50000, // $500.00 (in cents)
    //   currency: 'usd',
    //   description: 'Adding funds to balance',
    // });
    // console.log('===========================Top-up successful:', topUp);



    // const balance = await stripe.balance.retrieve();
    // console.log("===================balance amount:",balance);


    // const payout = await stripe.payouts.create(
    //   {
    //     amount: 1, // $100.00
    //     currency: 'usd',
    //   },
    //   {
    //     stripeAccount: 'acct_1QxqRII0GCgMrAo7', // Replace with the connected account ID
    //   }
    // );

    // console.log("===================payout: ", payout)

    // Create a payment record for the transaction
    const vendorPayment = new Payment({
      rentId: rid,
      clientId: rent.client._id,
      vendorId: rent.vendor._id,
      amount: totalVendorEarnings,
      paymentReason: 'returnAccept',
      paymentStatus: 'success',
      stripeTransferId: vendorTransfer.id, // Save Stripe transfer ID for reference
    });

    await vendorPayment.save();

    // const clientPayment = new Payment({
    //   rentId: rid,
    //   clientId: rent.client._id,
    //   vendorId: rent.vendor._id,
    //   amount: totalClientRefund,
    //   paymentReason: 'refund',
    //   paymentStatus: 'success',
    //   paymentType: 'debit', // Indicates this is a refund to the client
    //   stripeRefundId: refund.id, // Save Stripe refund ID for reference
    // });

    // await clientPayment.save();

    res.json({
      message: 'Return accepted successfully',
      vendorPayment,
      //clientPayment,
      vendorTransfer,
      //refund,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong in accept return book' });
  }
};

// Function to simulate account activation in test mode
async function simulateAccountActivation(accountId) {
  const account = await stripe.accounts.update(accountId, {
    tos_acceptance: {
      date: Math.floor(Date.now() / 1000),
      ip: '127.0.0.1', // Simulate IP address
    },
  });

  console.log('Account activated:', account.id);
}
export default vendorCtrl