export const buyValidationSchema={
    // book:{
    //     in:['body'],
    //     exists:{
    //         errorMessage:' book field is required'
    //     },
    //     notEmpty:{
    //         errorMessage:' book field cannot be empty'
    //     }
    // },
    // deliveryFee:{
    //     in:['body'],
    //     exists:{
    //         errorMessage:'delivery fee is required'
    //     },
    //     notEmpty:{
    //         errorMessage:'deliveryfee cannot be empty'
    //     }
    // },
    sellPrice:{
        in:['body'],
        exists:{
            errorMessage:'selling price is required'
        },
        notEmpty:{
            errorMessage:'selling price cannot be empty'
        }
    }

}