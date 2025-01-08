import { Schema,model } from "mongoose"
const userSchema=new Schema({
    name:String,
    email:String,
    password:String,
    phone:String,
    location:{city:String,state:String},
    role:{
        type:String,
        enum:['vendor','client','admin']
    }
    
},{timestamps:true})
const User=model('User',userSchema)
export default User