import { Schema,model } from "mongoose";
const sellingSchema=new Schema({
    book:{
        type:Schema.Types.ObjectId,
        ref:'Book'
    },
    vendor:{
        type:Schema.Types.ObjectId,
        ref:'Vendor'
    },
    client:{
        type:Schema.Types.ObjectId,
        ref:'Client'
    },
    deliveryStatus:{
        type:String,
        
        enum:['order placed','delivered']
    },
    sellPrice:Number,
    platformFee:{
        type:Number,
        default:10
    },
    deliveryFee:{
        type:Number,
        default:30
    },
    totalAmountToPay:Number
},{timestamps:true})

const Buy=model('Buy',sellingSchema)
export default Buy