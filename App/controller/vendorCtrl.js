import Vendor from "../models/vendor-model.js";
import User from "../models/user-model.js";

const vendorCtrl={}

vendorCtrl.allVendors=async(req,res)=>{
    try{
        const vendors=await User.find({role:'vendor'})
        res.json(vendors)
    }catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}

export default vendorCtrl