import Stripe from 'stripe'
import Payment from "../models/payment-model.js";
import Order from '../models/order-model.js'
const paymentCtrl={}
import Client from '../models/client-model.js';
import Vendor from '../models/vendor-model.js';
import Cart from '../models/cart-model.js';
import { notifyVendor } from "../../config/nodemailer-vendor.js";
import Rent from '../models/rental-model.js';
import Book from '../models/book-model.js';


const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)


paymentCtrl.pay=async(req,res)=>{
  const body=req.body
  try{
    const customer=await stripe.customers.create({
      name:'Testing',
      address:{
        line1:'India',
        postal_code:'691572',
        city:'Kollam',
        state:'KL',
        country:'US'
      }
    })
    const session=await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:[
        {
          price_data:{
            currency:'inr',
            product_data:{
              name:'initial-payment'
            },
            unit_amount:body.amount*100
          },
          quantity:1
        }
      ],
      mode:'payment',
      success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:3000/payment/failed",
      customer:customer.id,
      payment_intent_data:{
        capture_method:'automatic'
      },
      metadata:{
        orderId:body.orderId,
        paymentReason:'initialPay'
      }
    })
    console.log('sessionID',session.id)
    console.log('sessionURL',session.url)
    const order=await Order.findById(body.orderId)
    console.log('order',order)
    const payment=new Payment({
      orderId:body.orderId,
      transactionId:session.id,
      paymentReason:'initialPay',
      paymentType:'card',
      amount:body.amount,
      clientId:order.client,
      paymentStatus:'pending'
    })
    await payment.save()
    res.json({id:session.id,url:session.url})
  }catch(err){
    console.log('Error in initial Pay',err)
    res.status(500).json({error:'Payment processing failed'})
  }
}

paymentCtrl.getPaymentDetails = async (req, res) => {
  const { session_id } = req.query;
  try {
    if (!session_id) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent", "line_items"]
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const amount = session.amount_total || (session.line_items?.data[0]?.amount_total ?? 0);
    const status = session.payment_status || session.payment_intent?.status || "unknown";
    const isPaid = status === "succeeded";

    console.log('session', session);

    // Update payment record
    const paymentRecord = await Payment.findOneAndUpdate(
      { transactionId: session.id },
      { paymentStatus: isPaid ? "success" : "failed" },
      { new: true }
    );

    if (!paymentRecord) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    console.log('ispaid', isPaid);
    console.log('payment record', paymentRecord);
    console.log('paymentIntent', session.payment_intent.id);

    const oid = paymentRecord.orderId;
    console.log('oid', oid);

    const order = await Order.findById(oid).populate("book").populate("rent").populate("buy");
    console.log('order', order);

    if (order.rent) {
      const rentalStartDate = new Date();
      const dueDate = new Date(rentalStartDate);
      dueDate.setDate(rentalStartDate.getDate() + order.rent.period);

      await Rent.findByIdAndUpdate(order.rent._id, {
        client: order.client,
        rentalStartDate,
        dueDate,
        rentedBookStatus: "active",
        deliveryStatus: "order placed"
      }, { new: true });

      const updateBook = await Book.findByIdAndUpdate(order.book._id, {
        $set: { status: "notAvailable" },
        $inc: { rentCount: 1 }
      }, { new: true });
      console.log('updated book', updateBook);

      // Update Client with paymentIntent
      const updatedClient = await Client.findOneAndUpdate(
        { client: order.client }, // Query condition
        {
          $push: {
            rentedBooks: {
              $each: [
                {
                  book: order.book._id,
                  rent: order.rent._id
                }
              ],
              $position: 0
            }
          },
          $set: { paymentIntent: session.payment_intent.id } // Set paymentIntent
        },
        { new: true } // Return the updated document
      );

      if (!updatedClient) {
        console.error("Client not found or update failed");
      } else {
        console.log('Updated Client:', updatedClient);
      }

      const vendor = await Vendor.findOne({ vendor: order.book.vendor }).populate('vendor');
      if (vendor) {
        const existingEarningsIndex = vendor.totalEarnings?.findIndex(
          (entry) => entry.book.toString() === order.book._id.toString()
        );

        if (existingEarningsIndex > -1) {
          await Vendor.findOneAndUpdate(
            { _id: vendor._id, "totalEarnings.book": order.book._id },
            { $inc: { "totalEarnings.$.earnings": order.rent.pricing.readingFee } }
          );
        } else {
          await Vendor.findByIdAndUpdate(
            vendor._id,
            {
              $push: {
                totalEarnings: {
                  book: order.book._id,
                  earnings: order.rent.pricing.readingFee
                }
              }
            }
          );
        }

        await notifyVendor(vendor.vendor.email, {
          book: order.book.modifiedTitle,
          rentalStartDate,
          dueDate,
          type: "rent",
          pricing: order.rent.pricing
        });
      }
    }

    if (order.buy) {
      await Buy.findByIdAndUpdate(order.buy._id, {
        client: order.client,
        deliveryStatus: "orderPlaced"
      });

      await Book.findByIdAndUpdate(order.book._id, { status: "notAvailable" }, { new: true });

      // Update Client with paymentIntent
      const updatedClient = await Client.findOneAndUpdate(
        { client: order.client }, // Query condition
        {
          $push: {
            purchasedBooks: {
              $each: [
                {
                  book: order.book._id,
                  buyingDetails: order.buy._id
                }
              ],
              $position: 0
            }
          },
          $set: { paymentIntent: session.payment_intent.id } // Set paymentIntent
        },
        { new: true } // Return the updated document
      );

      if (!updatedClient) {
        console.error("Client not found or update failed");
      } else {
        console.log('Updated Client:', updatedClient);
      }

      const vendor = await Vendor.findOne({ vendor: order.book.vendor });
      if (vendor) {
        const existingEarningsIndex = vendor.totalEarnings?.findIndex(
          (entry) => entry.book.toString() === order.book._id.toString()
        );

        if (existingEarningsIndex > -1) {
          await Vendor.findOneAndUpdate(
            { _id: vendor._id, "totalEarnings.book": order.book._id },
            { $inc: { "totalEarnings.$.earnings": order.buy.sellPrice } }
          );
        } else {
          await Vendor.findByIdAndUpdate(
            vendor._id,
            {
              $push: {
                totalEarnings: {
                  book: order.book._id,
                  earnings: order.buy.sellPrice
                }
              }
            }
          );
        }

        await notifyVendor(vendor.vendor.email, {
          book: order.book.modifiedTitle,
          type: "buy",
          pricing: { sellPrice: order.buy.sellPrice }
        });
      }
    }

    // Clear cart after order is placed
    await Cart.deleteMany({ client: order.client });

    res.json({
      transactionId: session.id,
      amount,
      currency: session.currency,
      status,
      orderId: paymentRecord.orderId
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong in fetching session" });
  }
};

export default paymentCtrl