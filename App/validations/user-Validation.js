import User from "../models/user-model.js";


export const userRegisterSchema={
    email:{
        in:['body'],
        exists:{
            errorMessage:'email is required'
        },
        notEmpty:{
            errorMessage:'email field cannot be empty'
        },
        isEmail:{
            errorMessage:'email should be in valid format'
        },
        trim:true,
        normalizeEmail:true,
        custom:{
            options:async function (value){
                
                    const user=await User.findOne({email:value})
                    if(user){
                        throw new Error ('email is already taken')
                    }else{
                        return true
                    }
                
            }
        }
    },
    password:{
        in:['body'],
        exists:{
            errorMessage:'password field is required'
        },
        notEmpty:{
            errorMessage:'password field cannot be empty'
        },
        isStrongPassword:{
            options:{
                minLength:8,
                minSymbol:1,
                minNumber:1,
                minUpperCase:1,
                minLowerCase:1
            },
            errorMessage:'password should contain 8 characters with minimum 1 Uppercase,1 LowerCase,1 Symbol and 1 Number'


        }
    },
    name:{
        in:['body'],
        exists:{
            errorMessage:'name field is required'
        },
        notEmpty:{
            errorMessage:'name field cannot be empty'
        }
    }
}