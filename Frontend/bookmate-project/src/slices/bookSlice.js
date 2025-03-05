import {createSlice} from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../config/axios'

export const uploadedBooks=createAsyncThunk("books/uploadedBooks",async()=>{
    const response=await axios.get('/api/book/myBook',{headers:{Authorization:localStorage.getItem('token')}})
    console.log('books',response.data)
    return response.data
})

export const upload = createAsyncThunk('books/upload', async ({ form, resetForm }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/book/create', form, {
            headers: { Authorization: token }
        });
        resetForm();
        
        console.log('upload', response.data);
        return response.data;
    } catch (err) {
        console.log(err);
        return rejectWithValue(err.response?.data || err.message || 'An error occurred');
    }
});
export const deleteBook=createAsyncThunk('books/deleteBook',async(id,{rejectWithValue})=>{
    try{
        console.log('delete id',id)
        const response=await axios.delete(`/api/book/${id}/delete`,{
            headers:{Authorization:localStorage.getItem('token')}
        })
        console.log('deleted',response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response?.data || err.message || 'An error occurred');

    }
})
export const updateBook=createAsyncThunk('books/updateBook',async({id,resetForm,form,navigation},{rejectWithValue})=>{
    try{
        const response=await axios.put(`api/book/${id}/update`,form,{
            headers:{Authorization:localStorage.getItem('token')}
            
        })
        
        console.log('deleted',response.data)
        resetForm()
        navigation()
            return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response?.data || err.message || 'An error occurred');
    }
    
})

export const fetchClientCount=createAsyncThunk('books/fetchClientCount',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get('/api/book/clientCounts',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error||err.message)
    }
})
export const fetchEarnings=createAsyncThunk('books/fetchEarnings',async(_,{rejectWithValue})=>{
    try{

        const response=await axios.get('/api/vendor/earnings',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        console.log('earnings',response.data)
        return response.data
        
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response?.data.errors||err.message||'an error')
    }
})
export const verifiedBooks=createAsyncThunk('books/verifiedBooks',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get('/api/book/verified')
        console.log('verified',response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data)
        
    }
})
export const blockedBooks=createAsyncThunk('books/blockedBooks',async(_,{rejectWithValue})=>{
    try{
        const response=await axios.get('/api/book/blocked',{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
export const verify=createAsyncThunk('books/verify',async({bid,isVerified},{rejectWithValue})=>{
    try{
        const response=await axios.put(`/api/book/${bid}/verify`,{isVerified},{
            headers:{Authorization:localStorage.getItem('token')}
        })
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})
const bookSlice=createSlice({
    name:"books",
    initialState:{
        bookData:[],
        verified:[],
        blocked:[],
        uploaded:[],
        clientCount:{},
        earningsData:null,
        serverError:null,
        editId:null

    },
    reducers:{
        assignEditId:(state,action)=>{
            console.log('edit id',action.payload)
            state.editId=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(uploadedBooks.fulfilled,(state,action)=>{
            state.bookData=action.payload
            console.log('bookdata',state.bookData)
        })
    
        builder.addCase(upload.fulfilled,(state,action)=>{
            state.uploaded=(action.payload)
            state.serverError=null
        })
    
    
        builder.addCase(upload.rejected, (state, action) => {
            console.log('errors',action.payload)
            state.serverError = action.payload.error|| action.error.message || 'An unexpected error occurred';
        });
        builder.addCase(updateBook.fulfilled,(state,action)=>{
           state.rentData={...state.rentData,...action.payload}
            state.editId=null
        })
        builder.addCase(updateBook.rejected,(state,action)=>{
            state.serverError=action.payload.error
        })
        builder.addCase(deleteBook.fulfilled,(state,action)=>{
            const index=state.bookData.findIndex(ele=>ele._id==action.payload._id)
            state.bookData.splice(index,1)
        })
        builder.addCase(fetchClientCount.fulfilled,(state,action)=>{
            console.log('clientCount',action.payload)
            state.clientCount=action.payload
        })
        builder.addCase(fetchEarnings.fulfilled,(state,action)=>{
            console.log('earningsdata',action.payload)
            state.earningsData=action.payload
        })
        builder.addCase(fetchEarnings.rejected,(state,action)=>{
            state.serverError=action.payload?.errors
        })
        builder.addCase(verifiedBooks.fulfilled,(state,action)=>{
            state.bookData=action.payload
        })
        builder.addCase(verifiedBooks.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(blockedBooks.fulfilled,(state,action)=>{
            state.blocked=action.payload
        })
        builder.addCase(blockedBooks.rejected,(state,action)=>{
            state.serverError=action.payload
        })
        builder.addCase(verify.fulfilled, (state, action) => {
            const updatedBook = action.payload;
            
            // Update in verified list
            state.verified = state.verified.map(book =>
                book._id === updatedBook._id ? updatedBook : book
            );
        
            // Update in blocked list
            state.blocked = state.blocked.map(book =>
                book._id === updatedBook._id ? updatedBook : book
            );
        });
        
        builder.addCase(verify.rejected,(state,action)=>{
            state.serverError=action.payload
        })
    }
})
export const {assignEditId} =bookSlice.actions
export default bookSlice.reducer