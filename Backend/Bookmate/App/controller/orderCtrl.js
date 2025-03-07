import Order from "../models/order-model.js";
const orderCtrl={}

orderCtrl.myOrders=async(req,res)=>{
    try{
        const client=req.currentUser.userId
        const orders=await Order.find({client}).populate({
            path:'book',
            populate:{
                path:'vendor'
            }
        }).populate('rent').populate('buy').populate('client').populate('vendor')
        if(!orders){
            return res.status(404).json({error:'orders not found'})
        }
        res.json(orders)
    }catch(err){
        console.log(err)
        req.status(500).json({error:'something went wrong in myOrders'})
    }
}
export default orderCtrl