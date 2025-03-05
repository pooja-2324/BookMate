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
export const verifiedClients=createAsyncThunk('clients/verifiedClients',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get('/api/client/verified',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const blockedClients=createAsyncThunk('clients/blockedClients',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get('/api/client/blocked',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const updateClient=createAsyncThunk('clients/updateClient',async({cid,isApproved},{rejectWithValue})=>{
    try{
        const response=await axios.put(`/api/client/${cid}/update`,{isApproved},{
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
        verified:[],
        blocked:[],
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
         builder.addCase(verifiedClients.fulfilled,(state,action)=>{
                    state.verified=action.payload
                })
                builder.addCase(blockedClients.fulfilled,(state,action)=>{
                    state.blocked=action.payload
                })
        builder.addCase(updateClient.fulfilled,(state,action)=>{
            const { cid, isApproved } = action.payload;
            // Update verified clients list
            state.verified = state.verified.map((client) =>
              client._id === cid ? { ...client, isApproved } : client
            );
      
            // Update blocked clients list
            state.blocked = state.blocked.map((client) =>
              client._id === cid ? { ...client, isApproved } : client
            );
        })

    }
})
export default clientSlice.reducer