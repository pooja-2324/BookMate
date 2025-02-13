import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const myOrders=createAsyncThunk('orders/myOrders',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get('/api/order/my',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})

const orderSlice=createSlice({
    name:'orders',
    initialState:{
        orderData:[],
        serverError:null
    },
    extraReducers:(builder)=>{
        builder.addCase(myOrders.fulfilled,(state,action)=>{
            state.orderData=action.payload
            state.serverError=null
        })
        builder.addCase(myOrders.rejected,(state,action)=>{
            state.serverError=action.payload
        })
    }
})
export default orderSlice.reducer