import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const addToCart=createAsyncThunk('carts/addToCart',async({bid,action},{rejectWithValue})=>{
    try{
        const response=await axios.post(`/api/add/${bid}/cart`,{action},{
            headers:{authorization:localStorage.getItem('token')}
        })
        console.log('addtocart',bid)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data)
    }
})
export const fetchCart=createAsyncThunk('carts/fetchCart',async(_,{rejectWithValue})=>{
    try{
        const cart=await axios.get('/api/cart/all',{
            headers:{authorization:localStorage.getItem('token')}
        })
        return cart.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data)
    }
})
export const removeFromCart=createAsyncThunk('carts/removeFromCart',async(id,{rejectWithValue})=>{
    try{
        const response=await axios.delete(`/api/cart/${id}/remove`,{
            headers:{Authorization:localStorage.getItem('token')}
        })
        
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data)
    }
})
export const clearCart=createAsyncThunk('carts/clearCart',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.delete('/api/cart/clear',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data)
    }
})
const cartSlice=createSlice({
    name:'carts',
    initialState:{
        cartData:[],
        serverError:null
    },
    
    extraReducers:(builder)=>{
        builder.addCase(addToCart.fulfilled,(state,action)=>{
            state.cartData?.unshift(action.payload)
            console.log('cartdata',state.cartData)
            state.serverError=null
        })
        builder.addCase(addToCart.rejected,(state,action)=>{
            state.serverError=action.payload.error
        })
        builder.addCase(fetchCart.fulfilled,(state,action)=>{
            state.cartData=action.payload

        })
        builder.addCase(fetchCart.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(removeFromCart.fulfilled,(state,action)=>{
            const index=state.cartData?.findIndex(ele=>ele._id==action.payload)
            state.cartData.splice(index,1)
        })
        builder.addCase(removeFromCart.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(clearCart.fulfilled,(state,action)=>{
            state.cartData=action.payload
        })
        builder.addCase(clearCart.rejected,(state,action)=>{
            state.serverError=action.payload
        })
    }
})

export default cartSlice.reducer