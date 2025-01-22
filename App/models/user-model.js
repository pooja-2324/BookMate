import { Schema,model } from "mongoose"

const userSchema=new Schema({
    name:String,
    email:String,
    password:String,
    phone:String,
    otp:String,
    location:{city:String,state:String},
    role:{
        type:String,
        enum:['vendor','client','admin']
    },
   
    profilePic:{
        type:String,
        default:'profile pic default.jpg'
    }
    
},{timestamps:true})
const User=model('User',userSchema)
export default User