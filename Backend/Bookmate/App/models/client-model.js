import { Schema,model } from "mongoose";
const clientSchema=new Schema({
    client:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    rentedBooks:[{
        book:{
            type:Schema.Types.ObjectId,
            ref:'Book'
        },
        rent:{
            type:Schema.Types.ObjectId,
            ref:"Rent"
        }  
    }],
    purchasedBooks:[{
        book:{
            type:Schema.Types.ObjectId,
            ref:"Book"
        },
        buyingDetails:{
            type:Schema.Types.ObjectId,
            ref:'Buy'

        }
    }],
    refund:{
        type:Number,
        default:0
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    isApproved:{
        type:Boolean,
        default:true
    },
    paymentIntent:String,


},{timestamps:true})
const Client=model('Client',clientSchema)
export default Client