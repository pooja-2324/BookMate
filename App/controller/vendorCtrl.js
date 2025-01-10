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
vendorCtrl.oneVendor=async(req,res)=>{
    try{
        const id=req.params.id
        const vendor=await User.findById(id)
        if(!vendor){
            return res.status(404).json({error:'vendor not found'})
        }
        res.json(vendor)
    }catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}

export default vendorCtrl