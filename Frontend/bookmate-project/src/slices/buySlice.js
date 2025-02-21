import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const uploadBuy=createAsyncThunk('buys/uploadBuy',async({bid},{rejectWithValue})=>{
    try{
        const response=await axios.post(`/api/buy/${bid}/create`,{},{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data)
    }
})
export const currentPurchasedBooks=createAsyncThunk('buys/currentPurchasedBooks',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get('/api/buy/orderPlaced',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const SaleToDelivered=createAsyncThunk('buys/saleToDelivered',async(id,{rejectWithValue})=>{
    try{
        const response=await axios.put(`/api/buy/${id}/toDelivered`,{},{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})

const buySlice=createSlice({
    name:'buys',
    initialState:{
        buyData:[],
        serverError:null
    },
    extraReducers:(builder)=>{
        builder.addCase(uploadBuy.fulfilled,(state,action)=>{
            state.buyData=action.payload
            state.serverError=null
        })
        builder.addCase(uploadBuy.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(currentPurchasedBooks.fulfilled,(state,action)=>{
            state.buyData=action.payload
            state.serverError=null
        })
        builder.addCase(currentPurchasedBooks.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(SaleToDelivered.fulfilled,(state,action)=>{
            state.buyData=action.payload
            state.serverError=null
        })
        builder.addCase(SaleToDelivered.rejected,(state,action)=>{
            state.serverError=action.payload
        })
    }


})
export default buySlice.reducer