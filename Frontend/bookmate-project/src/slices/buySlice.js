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
    }


})
export default buySlice.reducer