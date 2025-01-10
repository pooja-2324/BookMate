import {Schema,model} from 'mongoose'
const rentSchema=new Schema({ 
    book:{
          type:Schema.Types.ObjectId,
          ref:"Book"
         },
    vendor:{
          type:Schema.Types.ObjectId,
          ref:"User"
         },
    client:{
          type:Schema.Types.ObjectId,
          ref:"User"
         },
    rentalStartDate:{
          type:Date,
          default:Date.now()
         },
    dueDate:Date,
    returnedDate:Date,
    status:{
          type:String,
          enum:["active","completed","late"]
         },
    pricing:{
          cautionDeposit:Number,
          readingFee:Number,
          deliveryFee:Number,
          lateFee:Number,
          damageFee:Number,
          platformFee:Number 
         },
    totalAmountToPay:Number //cautionDeposit + readingFee + platformFee + deliveryFee
        
},{timeStamps:true})

const Rent=model('Rent',rentSchema)
export default Rent

