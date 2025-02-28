import Client from "../models/client-model.js";
import User from "../models/user-model.js";
import Book from "../models/book-model.js";
import Rent from "../models/rental-model.js"
const clientCtrl={}

clientCtrl.allClients=async(req,res)=>{
    try{
        const clients=await User.find({role:'client'})
        if(!clients){
            return res.status(400).json({error:'no clients found'})

        }
        res.json(clients)
    }catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}
clientCtrl.getClientsUsingBooks=async(req,res)=>{
  
    try{
        const books=await Book.find()
        if(!books){
            return res.status(400).json({error:'no books found'})
        }
        const clientCounts={}
        for(const book of books){
            const clients=await Client.find({'rentedBooks.book':book._id})
            if(!clients){
                return res.status(404).json({error:'no clients rent this book'})
            }
            clientCounts[book._id]=clients.length
        }
        
        
        
        res.json(clientCounts)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }

}
clientCtrl.oneClient=async(req,res)=>{
    try{
        const id=req.params.id
        const client=await Client.findOne({client:id}).populate('rentedBooks.book').populate('rentedBooks.rent')
        if(!client){
            return res.status(404).json({error:'client not found'})
        }
        res.json(client)
    }catch(err){
        console.log(err)
        res.status(500).json({error:err})
    }
}
clientCtrl.bookClientRentDetails=async(req,res)=>{
    try{
        const clients=await Client.find().populate('rentedBooks.book rentedBooks.rent rentedBooks.rent.client')
        if(!clients){
            return res.status(404).json({error:'clients not found'})
        }
        const result=[]
        clients.forEach(ele=>{
            return result.push(ele.rentedBooks)

        })
        res.json(result)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
export default clientCtrl