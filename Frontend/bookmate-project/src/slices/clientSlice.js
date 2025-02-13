import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit"

import axios from "../config/axios"
export const fetchClient=createAsyncThunk('clients/fetchClient',async({id},{rejectWithValue})=>{
    try{
        const response=await axios.get(`/api/client/${id}`,{
            headers:{Authorization:localStorage.getItem('token')}
        })
        console.log('client',response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const fetchClientBookRentDetails=createAsyncThunk('clients/fetchClientBookRentDetails',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get('/api/client/book/rentDetails',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
const clientSlice=createSlice({
    name:'clients',
    initialState:{
        clientData:[],
        serverError:null,
        
    },
    extraReducers:(builder)=>{

        builder.addCase(fetchClient.fulfilled,(state,action)=>{
            state.clientData=action.payload
        })
        builder.addCase(fetchClientBookRentDetails.fulfilled,(state,action)=>{
            state.clientData=action.payload
            console.log('clientData',state.clientData)
        })
        builder.addCase(fetchClientBookRentDetails.rejected,(state,action)=>{
            state.serverError=action.payload
        })

    }
})
export default clientSlice.reducer