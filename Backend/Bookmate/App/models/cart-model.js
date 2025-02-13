import { Schema,model } from "mongoose";
const cartSchema=new Schema({
    book:{
        type:Schema.Types.ObjectId,
        ref:'Book'
    },
    client:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    rent:{
        type:Schema.Types.ObjectId,
        ref:'Rent'
    },
    buy:{
        type:Schema.Types.ObjectId,
        ref:'Buy'
    }

})
const Cart=model('Cart',cartSchema)
export default Cart