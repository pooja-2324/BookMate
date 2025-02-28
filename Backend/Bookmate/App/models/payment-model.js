import {Schema,model} from 'mongoose'

const paymentSchema=new Schema({
    orderId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Order', 
    },
    rentId:{
        type:Schema.Types.ObjectId,
        ref:'Rent'
    },
    transactionId:String,
    paymentReason:String,
    paymentType:String,
    amount:Number,
    
    clientId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
    },
   
    adminPayment: { 
        type: Number, 
    },
    vendorPayment: { 
        type: Number, 
    },
   PaymentStatus: { 
        type: String, 
        enum: ['pending', 'completed', 'failed', 'refunded'], 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})
const Payment=model('Payment',paymentSchema)
export default Payment