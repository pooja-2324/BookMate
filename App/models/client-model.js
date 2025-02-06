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
            ref:'Sell'

        }
    }],
    wallet:Number,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]

},{timestamps:true})
const Client=model('Client',clientSchema)
export default Client