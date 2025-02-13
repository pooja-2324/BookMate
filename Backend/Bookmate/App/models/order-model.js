import {Schema,model} from 'mongoose'
const orderSchema=new Schema({
    
    book:{
        type:Schema.Types.ObjectId,
        ref:'Book'
    },
    rent:{
        type:Schema.Types.ObjectId,
        ref:'Rent'
    },
    buy:{
        type:Schema.Types.ObjectId,
        ref:'Buy'
    },
    client:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

const Order=model('Order',orderSchema)
export default Order