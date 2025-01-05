import { Schema,model } from "mongoose"
const userSchema=new Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        enum:['vendor','client','admin']
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },
    
},{timeStamps:true})
const User=model('User',userSchema)
export default User