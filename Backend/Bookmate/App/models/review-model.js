import {Schema,model} from 'mongoose'
const reviewSchema=new Schema({
    reviewFor:{
        type:String,
        enum:['Client','Book']
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
    
    reviewedAt:{
        type:Date,
        default:Date.now()
    },
    reviewEntityId:{
        type:Schema.Types.ObjectId,
        refPath:'reviewFor'
    },
    photo:[
        {
            url:String,
            public_id:String
        }
    ]

},{timestamps:true})
const Review=model('Review',reviewSchema)
export default Review