import Book from "../models/book-model.js"

export const bookCreateSchema={
    title:{
        in:['body'],
        exists:{
            errorMessage:'title is required'
        },
        notEmpty:{
            errorMessage:'title field cannot be empty'
        },
        // options:{
        //     custom:async function(value){
        //         const books=await Book.find({vendor:req.currentUser.userId,title:value})
        //         if(books){
        //             throw new Error ('book is already uploaded')
        //         }
        //     }
        // }
    },
    description:{
        in:['body'],
        exists:{
            errorMessage:'description field is required'
        },
        notEmpty:{
            errorMessage:'description field cannot be empty'
        }
    },
    condition:{
        in:['body'],
        exists:{
            errorMessage:'condition is required'
        },
        notEmpty:{
            errorMessage:'condition cannot be empty'
        }
    },
    rentPrice:{
        in:['body'],
        exists:{
            errorMessage:'RentPrice is required'
        },
        notEmpty:{
            errorMessage:'RentPrice cannot be empty'
        }

    },
    sellPrice:{
        in:['body'],
        exists:{
            errorMessage:'SellPrice is required'
        },
        notEmpty:{
            errorMessage:'SellPrice cannot be empty'
        }

    }
}