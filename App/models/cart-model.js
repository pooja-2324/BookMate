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
    }

})
const Cart=model('Cart',cartSchema)
export default Cart