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
          default:new Date()
         },
    period:Number,
    dueDate:Date,
    returnedDate:Date,
    rentedBookStatus:{
          type:String,
          enum:["active","completed","late"]
         },

    pricing:{
          cautionDeposit:Number,
          readingFee:Number,
          deliveryFee:Number,
          platformFee:Number 
         },
         lateFee:Number,
          damageFee:Number,
      totalAmountToPay:Number ,//cautionDeposit + readingFee + platformFee + deliveryFee
      isDamaged:Boolean,
      deliveryStatus:{
            type:String,
            default:'order placed',
            enum:['order placed','delivered']
      }

        
},{timeStamps:true})

const Rent=model('Rent',rentSchema)
export default Rent

