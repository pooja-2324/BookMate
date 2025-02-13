import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";


export const uploadRentDetails=createAsyncThunk('rents/uploadRentDetails',async({bid,form,resetForm},{rejectWithValue})=>{
    try{
        const response=await axios.post(`/api/book/${bid}/rent/create`,form,{
            headers:{Authorization:localStorage.getItem('token')}
        })
        console.log('rentDetails',response.data)
        resetForm()
        return response.data
    }catch(err){
        console.log(err.response.data)
        return rejectWithValue(err.response.data)
    }
    
})
export const fetchRentDetails=createAsyncThunk('rents/fetchRentDetails',async(bid,{rejectWithValue})=>{
    try{
        const response=await axios.get(`/api/book/${bid}/rent`,{
            headers:{Authorization:localStorage.getItem('token')}
        })
        console.log('rentdetails',response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const updateRentDetails=createAsyncThunk('rents/updateRentDetails',async({id,form,resetForm},{rejectWithValue})=>{
    try{
        const response=await axios.put(`/api/rent/${id}/update`,form,{
            headers:{Authorization:localStorage.getItem('token')}
        })
        console.log('update',response.data)
        resetForm()
        return response.data
       
    }catch(err){
     console.log(err)
     return rejectWithValue(err.response.data)
    }
})
export const activeRent=createAsyncThunk('rents/activeRent',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get('/api/rent/active',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data)
    }
})
export const placeOrder=createAsyncThunk('rents/placeOrder',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.put('/api/rent/placeOrder',{},{
            headers:{Authorization:localStorage.getItem('token')}
        })

        console.log('placeOrder',response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const returnBook=createAsyncThunk('rents/returnBooks',async(id,{rejectWithValue})=>{
    try{
        const response=await axios.put(`/api/rent/${id}/return`,{},{
            headers:{Authorization:localStorage.getItem('token')}
        })
        console.log('return id',id)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const placeSingleOrder=createAsyncThunk('rents/placeSingleOrder',async(id,{rejectWithValue})=>{
    try{
        const response=await axios.put(`/api/rent/${id}/placeSingleOrder`,{},{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})

const rentSlice=createSlice({
    name:'rents',
    initialState:{
        rentData:[],
        serverError:null,
        editId:null
    },
    reducers:{
        assignEditId:(state,action)=>{
            console.log('editId',action.payload)
            state.editId=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(uploadRentDetails.fulfilled,(state,action)=>{
            console.log('rentdata',action.payload)
            state.rentData=(action.payload)
        })
        builder.addCase(uploadRentDetails.rejected,(state,action)=>{
            state.serverError=action.payload.error
        })
        builder.addCase(fetchRentDetails.fulfilled,(state,action)=>{
            console.log('fetch',typeof(action.payload))
            state.rentData=(action.payload)
        })
        builder.addCase(fetchRentDetails.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(updateRentDetails.fulfilled,(state,action)=>{
            console.log('rentdata',action.payload)
            const index=state.rentData.findIndex(ele=>ele._id==action.payload._id)
            state.rentData[index]=action.payload
            //state.rentData = { ...state.rentData, ...action.payload }
        })
        builder.addCase(updateRentDetails.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(activeRent.fulfilled,(state,action)=>{
            console.log('rentdataslice',action.payload)
            state.rentData=action.payload
        })
        builder.addCase(activeRent.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(placeOrder.fulfilled,(state,action)=>{
            state.rentData=action.payload
        })
        builder.addCase(placeOrder.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(returnBook.fulfilled,(state,action)=>{
            state.rentData=action.payload
            console.log('retun',action.payload)
            state.serverError=null
        })
        builder.addCase(returnBook.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(placeSingleOrder.fulfilled,(state,action)=>{
            state.rentData=action.payload
            state.serverError=null
        })
        builder.addCase(placeSingleOrder.rejected,(state,action)=>{
            state.serverError=action.payload
        })
       

    }
})
export const {assignEditId}=rentSlice.actions

export default rentSlice.reducer