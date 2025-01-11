import User from "../models/user-model.js";


export const userRegisterSchema={
    name:{
        in:['body'],
        exists:{
            errorMessage:'name field is required'
        },
        notEmpty:{
            errorMessage:'name field cannot be empty'
        },
        trim:true
    },
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
    role: {
        in: ['body'],
        custom: {
            options: async function (value) {
                const count = await User.countDocuments();
                if (count === 0) {
                    return true
                } else if (!value) {
                    throw new Error('role field is required')
                }
                return true;
            }
        }
    },
    location:{
        in:['body'],
        exists:{
            errorMessage:'location is required'
        },
        notEmpty:{
            errorMessage:'location cannot be empty'
        },
        options:{
            custom: function(value){
                if(!value.city||!value.state){
                    throw new Error('loaction city and state field is required')
                }
                return true
            }
        }

    },
    phone:{
        in:['body'],
        exists:{
            errorMessage:'phone field is required'
        },
        notEmpty:{
            errorMessage:'phone field cannot be empty'
        },
        custom:{
            options:async function(value) {
                const phoneRegex = /^[0-9]{10}$/;
                return phoneRegex.test(value)
            },
            errorMessage:'ivalid phoneNumber format'
        }
    }
    
}
export const userLoginSchema={
    email:{
        in:['body'],
        exists:{
            errorMessage:'email field is required'
        },
        notEmpty:{
            errorMessage:'email field cannot be empty'
        },
        isEmail:{
            errorMessage:'email should be in valid format'
        },
        normalizeEmail:true,
        trim:true
    },
    password:{
        in:['body'],
        exists:{
            errorMessage:'password field is required'
        },
        notEmpty:{
            errorMessage:'password field cannot be empty'
        },
        trim:true
    }
}
export const getOtpSchema={
    phone:{
        in:['body'],
        exists:{
            errorMessage:'phone field is required'
        },
        notEmpty:{
            errorMessage:'phone field cannot be empty'
        },
        trim:true
    }
}
export const verifyOtpSchema={
    phone:{
        in:['body'],
        exists:{
            errorMessage:'phone field is required'
        },
        notEmpty:{
            errorMessage:'phone field cannot be empty'
        },
        trim:true
    },
    otp:{
        in:['body'],
        exists:{
            errorMessage:'otp field is required'
        },
        notEmpty:{
            errorMessage:'otp field cannot be empty'
        },
        trim:true
    }
}