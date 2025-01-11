import Client from "../models/client-model.js";
import User from "../models/user-model.js";

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
clientCtrl.data=async(req,res)=>{

}

export default clientCtrl