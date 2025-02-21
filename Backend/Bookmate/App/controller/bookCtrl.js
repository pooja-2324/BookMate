import _ from 'lodash'
import Book from "../models/book-model.js";
import { validationResult } from 'express-validator';
import axios from 'axios'
import User from '../models/user-model.js';
import Vendor from '../models/vendor-model.js';
import Rent from '../models/rental-model.js';

const bookCtrl={}

bookCtrl.create=async(req,res)=>{
    const errors=validationResult(req)
  
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    try{
        const body=req.body
        const subject=await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${body.title}`)
        if(!subject.data.items[0].volumeInfo){
            return res.status(404).json({error:'Book not found in Open Library database'})
        }
        const result=subject.data.items[0].volumeInfo
        console.log('result',result)
        body.vendor=req.currentUser.userId
        body.modifiedTitle=result.title
        body.author=result.authors[0]
        body.pages=result.pageCount
        body.status='available'
        body.publishedYear=result.publishedDate
        body.coverImage=result.imageLinks.thumbnail
        body.genre=result.categories
        body.description=result.description
        // const response=await axios.get(`https://openlibrary.org/search.json?title=${body.title}`)
        // if (!response.data.docs || response.data.docs.length === 0) {
        //     return res.status(404).json({ error: 'Book not found in Open Library database' });
        // }
        // body.vendor=req.currentUser.userId
        // body.modifiedTitle=response.data.docs[0].title
        // body.author=response.data.docs[0].author_name[0]
        // body.pages=response.data.docs[0].number_of_pages_median
        
        // body.status='available'
        // body.publishedYear=response.data.docs[0].first_publish_year
        
        // const cover=response.data.docs[0].cover_i
        // body.coverImage=`https://covers.openlibrary.org/b/id/${cover}-L.jpg`
        // console.log('genre',body.modifiedTitle)
        // const subject=await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${body.modifiedTitle}`)
        // console.log('subject',subject.data.items[0].volumeInfo.categories[0])
        // body.genre=subject.data.items[0].volumeInfo.categories[0]
        
        
        const book=new Book(body)
        console.log('book',book)
        const vendor = await Vendor.findOne({vendor:req.currentUser.userId});
        //console.log('vendor',vendor)
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        vendor.uploadedBooks.push(book._id)
        await vendor.save()
        await book.save()
        res.status(201).json(book)
        
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
bookCtrl.allBooks=async(req,res)=>{
    try{
        const books=await Book.find()
        res.json([books])
    }catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}
bookCtrl.verified=async(req,res)=>{
    try{
        const books=await Book.find({isVerified:true}).populate('vendor').populate('reviews')
        if(!books){
            return res.status(400).json({error:'no books verified'})
        }
        res.json(books)

    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
bookCtrl.update=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    try{
        const id=req.params.id
        const body=_.pick(req.body,['title','description','sellPrice','rentPrice'])
        const book=await Book.findOneAndUpdate({_id:id,vendor:req.currentUser.userId},body,{new:true,runValidators:true})
        if(!book){
            return res.status(404).json({error:'unable to update'})
        }
        res.json(book)
    }catch(err){
        console.log(err)
        re.status(500).json({error:'something went wrong'})
    }
}
bookCtrl.withdraw=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    try{
        let book
        const id=req.params.id
       if(req.currentUser.role=='admin'){
         book=await Book.findByIdAndDelete(id)
       }
       else {
        book=await Book.findOneAndDelete({_id:id,vendor:req.currentUser.userId})
       }
       if(!book){
        return res.status(404).json({error:'book not found'})
       }
       const vendor = await Vendor.findOne({vendor:req.currentUser.userId});
        console.log('vendor',vendor)
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        // vendor.uploadedBooks.push(book._id)
        // await vendor.save()
       const bookIndex=await Book?.findIndex(ele=>ele._id==id)
       console.log('bookIndex',bookIndex)
       vendor.splice(bookIndex,1)
       await vendor.save()
       res.json({deletesuccessfully:book})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
bookCtrl.verify=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    try{
        const id=req.params.id
        const body=_.pick(req.body,['isVerified'])
        const book=await Book.findOneAndUpdate({_id:id},body,{new:true,runValidators:true})
        if(!book){
            return res.status(404).json({error:'book not found'})
        }
        res.json(book)
    }catch(err){
    console.log(err)
    res.status(500).json({error:'something went wrong'})
    }
}
bookCtrl.oneBook=async(req,res)=>{
    try{
        const id=req.params.id
        const book=await Book.findById(id).populate('reviews')
        console.log('oneBook',book)
        if(!book){
            return res.status(404).json({error:'book not found'})
        }
        res.json(book)
    }catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}
bookCtrl.specific=async(req,res)=>{
    try{
        const {vid,bid} =req.params
        const vendor=await User.findById(vid)
        if(!vendor){
            return res.status(404).json({error:'vendor not found'})
        }
        const book=await Book.findOne({vendor:vid,_id:bid})
        if(!book){
            return res.status(404).json({error:'book not found'})
        }
        res.json(book)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}

bookCtrl.myBooks=async(req,res)=>{
    try{
        const user=req.currentUser.userId
        console.log('user',user)
        const response=await Book.find({vendor:user})
        if (!response) {
            return res.status(404).json({ error: 'No books found for this vendor' });
        }
        res.json(response)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}

export default bookCtrl