import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const createReviews=createAsyncThunk('reviews/createReviews',async({review},{rejectWithValue})=>{
    try{
        const response=await axios.post('/api/review/create',review,{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const getReviews=createAsyncThunk('reviews/getReviews',async({bid},{rejectWithValue})=>{
    try{
        const response=await axios.get(`/api/review/${bid}`,{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const oneReview=createAsyncThunk('reviews/oneReview',async({rid},{rejectWithValue})=>{
    try{
        const response=await axios.get(`/api/review/${rid}`,{
            headers:{Authorization:localStorage.getItem('token')}
    })
    return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const reviewPhoto=createAsyncThunk('reviews/reviewPhoto',async({rid,formData},{rejectWithValue})=>{
    try{
        const response=await axios.post(`/api/review/${rid}/upload`,formData,{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})


const reviewSlice=createSlice({
    name:'reviews',
    initialState:{
        reviewData:[],
        serverError:null
    },
    extraReducers:(builder)=>{
        builder.addCase(createReviews.fulfilled,(state,action)=>{
            state.reviewData=action.payload
            console.log('reviewData',state.reviewData)
            state.serverError=null
        })
        builder.addCase(createReviews.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(getReviews.fulfilled,(state,action)=>{
            state.reviewData=action.payload
            state.serverError=null
        })
        builder.addCase(getReviews.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(reviewPhoto.fulfilled,(state,action)=>{
            state.reviewData=action.payload
            console.log('reviewPhoto',state.reviewData)
        })
        builder.addCase(oneReview.fulfilled,(state,action)=>{
            state.reviewData=action.payload
        })
        builder.addCase(oneReview.rejected,(state,action)=>{
            state.serverError=action.payload
        })
    }
})
export default reviewSlice.reducer