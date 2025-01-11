import Rent from "../models/rental-model.js";

export const rentDetailsSchema={
    book:{
        in:['body'],
        exists:{
            errorMessage:' book field is required'
        },
        notEmpty:{
            errorMessage:' book field cannot be empty'
        }
    },
    period:{
        in:['body'],
        exists:{
            errorMessage:' period field is required'
        },
        notEmpty:{
            errorMessage:'period field cannot be empty'
        }
    },
    pricing:{
        in:['body'],
        exists:{
            errorMessage:'pricing field is required'
        },
        notEmpty:{
            errorMessage:'pricing field cannot be empty'
        },
        custom:{
            options: function(value){
                if(!value.cautionDeposit||!value.readingFee||!value.deliveryFee||!value.platformFee){
                    throw new Error ('All pricing fields are mandatory')
                }
                return true
            }
        }
    }
    
}