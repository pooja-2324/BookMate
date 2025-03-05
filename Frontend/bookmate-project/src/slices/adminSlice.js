import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const allUsers=createAsyncThunk('admin/allUsers',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get('/api/user/all',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})

const adminSlice=createSlice({
    name:'admin',
    initialState:{
        adminData:[],
        
        serverError:null
    },
    extraReducers:(builder)=>{
       builder.addCase(allUsers.fulfilled,(state,action)=>{
        state.adminData=action.payload
       })
       builder.addCase(allUsers.rejected,(state,action)=>{
        state.serverError=action.payload
       })
    }
})
export default adminSlice.reducer