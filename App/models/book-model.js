import {Schema,model} from 'mongoose'
const bookSchema=new Schema({
    title:String,
    modifiedTitle:String,
    author:String,
    pages:Number,
    genre:Array,
    publishedYear:String,
    condition:{
        type:String,
        enum:['new','good','fair']
    },
    rentPrice:Number,
    sellPrice:Number,
    isVerified:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:['available','notAvailable','withdrawn'],
        
    },
    description:String,
   
    isSelling:Boolean,
    coverImage:String,//open book api
    vendor:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
    rentCount:Number
},{timestamps:true})

const Book=model('Book',bookSchema)
export default Book