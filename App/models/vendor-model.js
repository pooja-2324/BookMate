import {Schema,model} from 'mongoose'
const vendorSchema=new Schema({
    vendor:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    uploadedBooks:[{type:Schema.Types.ObjectId,ref:'Book'}],
    totalEarnings:Number,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]


},{timestamps:true})

const Vendor=model('Vendor',vendorSchema)
export default Vendor