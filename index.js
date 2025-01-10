import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import session from "express-session"
import { checkSchema } from "express-validator"

import configureDB from "./config/db.js"

configureDB()
dotenv.config()

import { AuthenticateUser } from "./App/middleware/authentication.js"
import {AuthorizeUser} from "./App/middleware/authorizeUser.js"
import { AccountStatus } from "./App/middleware/checkAccountStatus.js"

import userCtrl from "./App/controller/userCtrl.js"
import vendorCtrl from "./App/controller/vendorCtrl.js"
import bookCtrl from "./App/controller/bookCtrl.js"
import rentCtrl from "./App/controller/rentCtrl.js"
import reviewCtrl from "./App/controller/reviewCtrl.js"

import { userRegisterSchema } from "./App/validations/user-Validation.js"
import { idValidationSchema } from "./App/validations/idValidationSchema.js"
import { bookCreateSchema } from "./App/validations/book-validation.js"


const app=express()
app.use(express.json())
app.use(cors())
app.use(session({
    secret: 'poojaramesh6633', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.post('/api/user/register',checkSchema(userRegisterSchema),userCtrl.register)
app.post('/api/user/login',userCtrl.login)
app.post('/api/user/getOtp',userCtrl.getOtp)
app.post('/api/user/verifyOtp',userCtrl.verifyOtp)
app.get('/api/user/account',AuthenticateUser,userCtrl.account)

app.get('/api/vendor/allVendors',AuthenticateUser,AuthorizeUser(['admin']),vendorCtrl.allVendors)
app.get('/api/vendor/:id',AuthenticateUser,AuthorizeUser(['admin']),vendorCtrl.oneVendor)

app.post('/api/book/create',AuthenticateUser,AuthorizeUser(['vendor']),checkSchema(bookCreateSchema),checkSchema(AccountStatus),bookCtrl.create)
app.get('/api/book/allBooks',bookCtrl.allBooks)
app.put('/api/book/:id/update',AuthenticateUser,AuthorizeUser(['vendor']),checkSchema(bookCreateSchema),checkSchema(idValidationSchema),bookCtrl.update)
app.delete('/api/book/:id/delete',AuthenticateUser,AuthorizeUser(['vendor','admin']),checkSchema(idValidationSchema),bookCtrl.withdraw)
app.put('/api/book/:id/verify',AuthenticateUser,AuthorizeUser(['admin']),checkSchema(idValidationSchema),bookCtrl.verify)
app.get('/api/book/:id',bookCtrl.oneBook)
app.get('/api/vendor/:vid/book/:bid',AuthenticateUser,AuthorizeUser(['admin']),bookCtrl.specific)

app.post('/api/rent/create',AuthenticateUser,AuthorizeUser(['vendor']),rentCtrl.create)

app.post('/api/review/create',AuthenticateUser,reviewCtrl.create)

app.listen(process.env.PORT,()=>{
    console.log('server is listening on port',process.env.PORT)
})