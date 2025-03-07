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

vendorCtrl.acceptReturn = async (req, res) => {

  try {
    const { rid } = req.body;
    const rent = await Rent.findById(rid).populate('book').populate('client').populate('vendor');

    if (!rent) {
      return res.status(400).json({ error: 'Rent not found' });
    }

    const cautionDeposit = rent.pricing.cautionDeposit;
    const readingFee = rent.pricing.readingFee;
    const platformFee = rent.pricing.platformFee;
    const deliveryFee = rent.pricing.deliveryFee;
    const returnDate = new Date();
    const lateFee = rent.dueDate < returnDate ? (returnDate - rent.dueDate) / (1000 * 60 * 60 * 24) * 10 : 0; // Calculate late fee for each day over due date

    const totalClientRefund = cautionDeposit - rent.damageFee;
    const totalVendorEarnings = rent.damageFee + lateFee * 0.5;

    // Update client's balance
    await Client.findByIdAndUpdate(rent.client._id, {
      $inc: { refund: totalClientRefund }

    });

    // Update vendor's balance
    const vendor = await Vendor.findOne({ vendor: rent.vendor._id });

    if (vendor) {
      const existingEarningsIndex = vendor.totalEarnings?.findIndex(
        (entry) => entry.book.toString() === rent.book._id.toString()
      );

      if (existingEarningsIndex > -1) {
        await Vendor.findOneAndUpdate(
          { _id: vendor._id, "totalEarnings.book": rent.book._id },
          { $inc: { "totalEarnings.$.earnings": totalVendorEarnings } }
        );
      } else {
        await Vendor.findByIdAndUpdate(
          vendor._id,
          {
            $push: {
              totalEarnings: {
                book: rent.book._id,
                earnings: totalVendorEarnings
              }
            }
          }
        );
      }
    }

    // Update book status
    await Book.findByIdAndUpdate(rent.book._id, {
      status: "available"
    }, { new: true });

    // Update rent status
    await Rent.findByIdAndUpdate(rid, {
      rentedBookStatus: "completed",
      returnedDate: new Date()
    }, { new: true });

    // Create a payment record for the transaction
    const vendorPayment = new Payment({
      rentId: rid,
      clientId: rent.client._id,
      vendorId: rent.vendor._id,
      amount: totalVendorEarnings,
      paymentReason: 'returnAccept',
      paymentStatus: 'success'
    });

    await vendorPayment.save();

    const clientPayment = new Payment({
      rentId: rid,
      clientId: rent.client._id,
      vendorId: rent.vendor._id,
      amount: totalClientRefund,
      paymentReason: 'refund',
      paymentStatus: 'success',
      paymentType: 'debit' // Indicates this is a refund to the client
    });

    await clientPayment.save();

    res.json({ message: "Return accepted successfully", vendorPayment, clientPayment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
// Replace with your Stripe secret key

// vendorCtrl.acceptReturn = async (req, res) => {
//   try {
//     const { rid } = req.body;

//     // Simulate account activation for the vendor in test mode
//     const vendorAccountId = 'acct_1QxqRII0GCgMrAo7'; // Replace with the vendor's test account ID


//     const rent = await Rent.findById(rid)
//       .populate('book')
//       .populate('client')
//       .populate('vendor');

//     if (!rent) {
//       return res.status(400).json({ error: 'Rent not found' });
//     }

//     const cautionDeposit = rent.pricing.cautionDeposit;
//     const readingFee = rent.pricing.readingFee;
//     const platformFee = rent.pricing.platformFee;
//     const deliveryFee = rent.pricing.deliveryFee;
//     const returnDate = new Date();
//     const lateFee =
//       rent.dueDate < returnDate
//         ? ((returnDate - rent.dueDate) / (1000 * 60 * 60 * 24)) * 10
//         : 0; // Calculate late fee for each day over due date

//     const totalClientRefund = cautionDeposit - rent.damageFee;
//     const totalVendorEarnings = rent.pricing.readingFee + rent.damageFee + (lateFee * 0.5);
//     console.log('crefund', totalClientRefund, 'vearnings', totalVendorEarnings);

//     const client = await Client.findOne({ client: rent.client._id });
//     console.log('rent', rent);

//     if (!client || !client.paymentIntent) {
//       return res.status(400).json({ error: 'Client or payment intent ID is missing' });
//     }

//     if (totalClientRefund <= 0) {
//       return res.status(400).json({ error: 'Invalid refund amount' });
//     }

//     // Validate amounts before Stripe API calls
//     const refundAmountInCents = Math.round(totalClientRefund * 100);
//     const vendorEarningsInCents = Math.round(totalVendorEarnings * 100);

//     console.log('refund', refundAmountInCents, 'earnings', vendorEarningsInCents);

//     if (refundAmountInCents < 1 || vendorEarningsInCents < 1) {
//       return res.status(400).json({ error: 'Amount must be at least 0.01 USD' });
//     }

//     // Update client's balance
//     await Client.findByIdAndUpdate(rent.client._id, {
//       $inc: { refund: totalClientRefund },
//     });

//     // Update vendor's balance
//     const vendor = await Vendor.findOne({ vendor: rent.vendor._id });

//     if (vendor) {
//       const existingEarningsIndex = vendor.totalEarnings?.findIndex(
//         (entry) => entry.book.toString() === rent.book._id.toString()
//       );

//       if (existingEarningsIndex > -1) {
//         await Vendor.findOneAndUpdate(
//           { _id: vendor._id, 'totalEarnings.book': rent.book._id },
//           { $inc: { 'totalEarnings.$.earnings': totalVendorEarnings } }
//         );
//       } else {
//         await Vendor.findByIdAndUpdate(vendor._id, {
//           $push: {
//             totalEarnings: {
//               book: rent.book._id,
//               earnings: totalVendorEarnings,
//             },
//           },
//         });
//       }
//     }

//     // Update book status
//     // await Book.findByIdAndUpdate(
//     //   rent.book._id,
//     //   {
//     //     status: 'available',
//     //   },
//     //   { new: true }
//     // );

//     // // Update rent status
//     // await Rent.findByIdAndUpdate(
//     //   rid,
//     //   {
//     //     rentedBookStatus: 'completed',
//     //     returnedDate: new Date(),
//     //   },
//     //   { new: true }
//     // );

//     // Refund to Client
//     const refund = await stripe.transfers.create({
//       amount: 1,
//       currency: 'inr',
//       destination: "cus_RslJUmJkEmGbMv", // Replace with the client's Stripe account ID
//       description: 'Refund for caution deposit',
//     });

//     console.log("refund ======", refund)

//     const paymentIntent = await stripe.paymentIntents.retrieve(client.paymentIntent);
//     console.log('Original Amount:', paymentIntent.amount);
//     console.log('Refunded Amount:', paymentIntent.amount_refunded);
//     console.log('Unrefunded Amount:', paymentIntent.amount - paymentIntent.amount_refunded);

//     // Transfer to Vendor's Connected Account
//     // const vendorTransfer = await stripe.payouts.create({
//     //   amount: 14908, // Amount in cents
//     //   currency: 'usd', // Replace with your currency
//     //   destination:"acct_1QxqRII0GCgMrAo7",// Vendor's connected account ID
//     //   description: `Earnings from book rental (Rent ID: ${rid})`,
//     // });

//     // const topUp = await stripe.topups.create({
//     //   amount: 50000, // $500.00 (in cents)
//     //   currency: 'usd',
//     //   description: 'Adding funds to balance',
//     // });
//     // console.log('===========================Top-up successful:', topUp);



//     // const balance = await stripe.balance.retrieve();
//     // console.log("===================balance amount:",balance);


//     // const payout = await stripe.payouts.create(
//     //   {
//     //     amount: 1, // $100.00
//     //     currency: 'usd',
//     //   },
//     //   {
//     //     stripeAccount: 'acct_1QxqRII0GCgMrAo7', // Replace with the connected account ID
//     //   }
//     // );

//     // console.log("===================payout: ", payout)

//     // Create a payment record for the transaction
//     const vendorPayment = new Payment({
//       rentId: rid,
//       clientId: rent.client._id,
//       vendorId: rent.vendor._id,
//       amount: totalVendorEarnings,
//       paymentReason: 'returnAccept',
//       paymentStatus: 'success',
//       stripeTransferId: vendorTransfer.id, // Save Stripe transfer ID for reference
//     });

//     await vendorPayment.save();

//     // const clientPayment = new Payment({
//     //   rentId: rid,
//     //   clientId: rent.client._id,
//     //   vendorId: rent.vendor._id,
//     //   amount: totalClientRefund,
//     //   paymentReason: 'refund',
//     //   paymentStatus: 'success',
//     //   paymentType: 'debit', // Indicates this is a refund to the client
//     //   stripeRefundId: refund.id, // Save Stripe refund ID for reference
//     // });

//     // await clientPayment.save();

//     res.json({
//       message: 'Return accepted successfully',
//       vendorPayment,
//       //clientPayment,
//       vendorTransfer,
//       //refund,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Something went wrong in accept return book' });
//   }
// };

// Function to simulate account activation in test mode


// paymentCtlr.payServiceFee = async (req, res) => {

//   const { serviceRequestId, expertId, amount } = req.body;
//   console.log({ serviceRequestId, expertId, amount });

//   try {
//       const expert = await Expert.findOne({ userId: expertId });
//       if (!expert || !expert.stripeAccountId) {
//           return res.status(400).json({ errors: "Expert Stripe account not found" });
//       }

//       const systemShare = Math.round(amount * 0.10); 
//       const expertShare = Math.round(amount * 0.90);

//       const BASE_URL = process.env.CLIENT_URL || "http://localhost:3000";

//       let customer = await stripe.customers.create({
//           name: "Testing",
//           address: {
//               line1: "India",
//               postal_code: "639006",
//               city: "Karur",
//               state: "TN",
//               country: "US",
//           },
//       });

//       console.log("Customer Created:", customer.id);

//       const session = await stripe.checkout.sessions.create({
//           payment_method_types: ["card"],
//           mode: "payment",
//           success_url: ${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID},
//           cancel_url: ${BASE_URL}/payment/failed,
//           customer: customer.id,
//           line_items: [
//               {
//                   price_data: {
//                       currency: "inr",
//                       product_data: { name: "Service Fee" },
//                       unit_amount: amount * 100, 
//                   },
//                   quantity: 1,
//               },
//           ],
//           payment_intent_data: {
//               application_fee_amount: systemShare * 100, 
//               transfer_data: {
//                   destination: expert.stripeAccountId, 
//               },
//           },
//           metadata: {
//               serviceRequestId,
//               expertId,
//               paymentReason: "service",
//           },            
//       });

//       console.log("Session ID:", session.id);
//       console.log("Session URL:", session.url);

//       const payment = new Payment({
//           serviceRequestId,
//           expertId,
//           // customerId : req.currentUser.userId,
//           transactionId: session.id,
//           paymentReason: "service",
//           paymentType: "card",
//           amount,
//           systemAmount: systemShare,
//           expertAmount: expertShare,
//           status: "pending",
//       });

//       await payment.save();
//       console.log(payment);

//       res.json({ id: session.id, url: session.url });

//   } catch (err) {
//       console.error(err);
//       return res.status(500).json({ errors: "Something went wrong" });
// vendorCtrl.acceptReturn = async (req, res) => {
//   try {
//     const { rid } = req.body;

//     // Simulate account activation for the vendor in test mode
//     const vendorAccountId = 'acct_1QxqRII0GCgMrAo7'; // Replace with the vendor's test account ID

//     const rent = await Rent.findById(rid)
//       .populate('book')
//       .populate('client')
//       .populate('vendor');

//     if (!rent) {
//       return res.status(400).json({ error: 'Rent not found' });
//     }

//     const cautionDeposit = rent.pricing.cautionDeposit; // Assume ₹100
//     const readingFee = rent.pricing.readingFee; // Assume ₹50
//     const platformFee = rent.pricing.platformFee; // Assume ₹10
//     const deliveryFee = rent.pricing.deliveryFee; // Assume ₹20
//     const returnDate = new Date();
//     const lateFee =
//       rent.dueDate < returnDate
//         ? ((returnDate - rent.dueDate) / (1000 * 60 * 60 * 24)) * 10
//         : 0; // Calculate late fee for each day over due date

//     const totalClientRefund = cautionDeposit - rent.damageFee; // Assume ₹200
//     const totalVendorEarnings = rent.pricing.readingFee + rent.damageFee + (lateFee * 0.5); // Assume ₹100
//     console.log('crefund', totalClientRefund, 'vearnings', totalVendorEarnings);

//     const client = await Client.findOne({ client: rent.client._id });

//     if (!client || !client.paymentIntent) {
//       return res.status(400).json({ error: 'Client or payment intent ID is missing' });
//     }

//     // Validate amounts before Stripe API calls
//     const MINIMUM_AMOUNT_INR = 50; // ₹50 is the minimum amount for INR
//     const vendorEarningsInPaise = Math.round(totalVendorEarnings * 100); // Convert to paise
//     console.log('vendorEarningsInPaise',vendorEarningsInPaise)
//     if (vendorEarningsInPaise < MINIMUM_AMOUNT_INR * 100) {
//       return res.status(400).json({ error: `Amount must be at least ₹${MINIMUM_AMOUNT_INR}` });
//     }

//     // Retrieve the payment intent to check the unrefunded amount
//     const paymentIntent = await stripe.paymentIntents.retrieve(client.paymentIntent);
//     console.log('payment intent', paymentIntent);
//     const unrefundedAmount = paymentIntent.amount - paymentIntent.amount_refunded; // Remaining unrefunded balance in paise

//     console.log('Original Amount:', paymentIntent.amount);
//     console.log('Refunded Amount:', paymentIntent.amount_refunded);
//     console.log('Unrefunded Amount:', unrefundedAmount);

//     // Update client's balance
//     const updatedClient = await Client.findByIdAndUpdate(rent.client._id, {
//       $inc: { refund: 1500 },
//     });

//     // Update vendor's balance
//     const vendor = await Vendor.findOne({ vendor: rent.vendor._id });

//     // Refund to Client
//     // const refund = await stripe.refunds.create({
//     //   payment_intent: client.paymentIntent,
//     //   amount: 1500, // Amount in paise
//     // });

//     // console.log("refund ======", refund);

//     const BASE_URL = process.env.CLIENT_URL || "http://localhost:3000";

//     // Create a customer for the checkout session
//     const customer = await stripe.customers.create({
//       name: "Testing",
//       address: {
//         line1: "India",
//         postal_code: "639006",
//         city: "Karur",
//         state: "TN",
//         country: "US",
//       },
//     });

//     console.log("Customer Created:", customer.id);

//     // Create a checkout session for the vendor fee
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${BASE_URL}/payment/failed`,
//       customer: customer.id,
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: { name: "Vendor Fee" },
//             unit_amount: 5000, // Amount in paise
//           },
//           quantity: 1,
//         },
//       ],
//       payment_intent_data: {
//         application_fee_amount: 10 * 100, // Application fee in paise
//         transfer_data: {
//           destination: vendorAccountId, // Vendor's connected account ID
//         },
//       },
//       metadata: {
//         vendorId: vendor._id.toString(),
//         paymentReason: "service",
//       },
//     });

//     console.log("Session ID:", session.id);
//     console.log("Session URL:", session.url);

//     // Create a payment record for the transaction
//     const vendorPayment = new Payment({
//       rentId: rid,
//       clientId: rent.client._id,
//       vendorId: rent.vendor._id,
//       amount: 5000,
//       paymentReason: 'returnAccept',
//       paymentStatus: 'success',
//       stripeTransferId: session.id, // Save Stripe session ID for reference
//     });

//     await vendorPayment.save();

//     res.json({
//       message: 'Return accepted successfully',
//       sessionId: session.id,
//       sessionUrl: session.url,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Something went wrong in accept return book' });
//   }
// };
export default vendorCtrl