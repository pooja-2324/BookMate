import { Schema,model } from "mongoose"

const userSchema=new Schema({
    name:String,
    email:String,
    password:String,
    phone:String,
    otp:String,
    googleId:String,
    location:{city:String,state:String},
    role:{
        type:String,
        enum:['vendor','client','admin']
    },
   
    profilePic: {
        type: {
          url: String, // URL of the profile picture
          public_id: String, // Public ID for Cloudinary
        },
        default: {
          url: "https://res.cloudinary.com/dd9m2vjxn/image/upload/v1739938352/default_profile_cikqzr.png",
          public_id: "default_profile_cikqzr", // Public ID of the default image in Cloudinary
        },
      },
    
},{timestamps:true})
const User=model('User',userSchema)
export default User