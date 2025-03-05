import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";
export const verifiedVendors=createAsyncThunk('vendors/verifiedVendors',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get('/api/vendor/verified',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const blockedVendors=createAsyncThunk('vendors/blockedVendors',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get('/api/vendor/blocked',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const updateVendor=createAsyncThunk('vendors/updateVendors',async({vid,isApproved},{rejectWithValue})=>{
    try{
        console.log('vid','idApproved',vid,isApproved)
        const response=await axios.put(`/api/vendor/${vid}/update`,{isApproved},{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err.response.data.error)
        return rejectWithValue(err.response.data.error)
    }
})

const VendorSlice=createSlice({
    name:'vendors',
    initialState:{
        verified:[],
        blocked:[],
        serverError:null
    },
    extraReducers:(builder)=>{
         builder.addCase(verifiedVendors.fulfilled,(state,action)=>{
                    state.verified=action.payload
                })
                builder.addCase(verifiedVendors.rejected,(state,action)=>{
                    state.serverError=action.payload
                })
                builder.addCase(blockedVendors.fulfilled,(state,action)=>{
                    state.blocked=action.payload
                    console.log('blocked',state.blocked)
                })
                builder.addCase(blockedVendors.rejected,(state,action)=>{
                    state.serverError=action.payload
                })
        builder.addCase(updateVendor.fulfilled,(state,action)=>{
            const { vid, isApproved } = action.payload;
            // Update verified vendors list
            state.verified = state.verified.map((vendor) =>
              vendor._id === vid ? { ...vendor, isApproved } : vendor
            );
      
            // Update blocked vendors list
            state.blocked = state.blocked.map((vendor) =>
              vendor._id === vid ? { ...vendor, isApproved } : vendor
            );
        })
        builder.addCase(updateVendor.rejected,(state,action)=>{
            state.serverError=action.payload
        })
    }
})
export default VendorSlice.reducer
