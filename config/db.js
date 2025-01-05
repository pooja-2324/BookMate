import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()
 
const configureDB=async ()=>{
    try{
        const response=await mongoose.connect(process.env.DB_URL)
        console.log('connected to db')
    }catch(err){
        console.log(err,'error connected to db')

    }
}
export default configureDB
