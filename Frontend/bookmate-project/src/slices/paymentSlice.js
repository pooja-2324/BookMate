import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";
 
export const makePayment=createAsyncThunk('payments/makePayment',async(body,{rejectWithValue})=>{
    try{
        const response=await axios.post(`/api/payment/initialPay`,body,{
            headers:{Authorization:localStorage.getItem('token')}
        })
        console.log('body',body)
        console.log('payment made',response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const paymentConfirm=createAsyncThunk('payments/paymentConfirm',async({oid,stripePaymentIntendId},{rejectWithValue})=>{
    try{
        const response=await axios.put(`/api/payment/order/${oid}/confirm`,{stripePaymentIntendId},{
            headers:{Authorization:localStorage.getItem('token')}
        })
        console.log('confirm',response.data,'oid',oid)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const acceptReturn=createAsyncThunk('payments/acceptReturn',async({rid},{rejectWithValue})=>{
    try{
        const response=await axios.post('/api/vendor/acceptReturn',{rid},{
            headers:{Authorization:localStorage.getItem('token')}
        })
        console.log('rid',rid)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})

const paymentSlice=createSlice({
    name:'payments',
    initialState:{
        paymentData:[],
        serverError:null
    },
    extraReducers:(builder)=>{
        builder.addCase(makePayment.fulfilled,(state,action)=>{
            state.paymentData=action.payload
        })
        builder.addCase(makePayment.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(paymentConfirm.fulfilled,(state,action)=>{
            state.paymentData=action.payload
        })
        builder.addCase(paymentConfirm.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(acceptReturn.fulfilled,(state,action)=>{
            state.paymentData=action.payload
        })
        builder.addCase(acceptReturn.rejected,(state,action)=>{
            state.serverError=action.payload
        })
    }
})
export default paymentSlice.reducer