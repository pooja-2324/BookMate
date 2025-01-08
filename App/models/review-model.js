import {Schema,model} from 'mongoose'
const reviewSchema=new Schema({
    reviewFor:{
        type:String,
        enum:['client','vendor','book']
    },
    reviewBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviewText:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    reviwedAt:{
        type:Date,
        Date:Date.now()
    }

},{timestamps:true})
const Review=model('Review',reviewSchema)
export default reviewSchema