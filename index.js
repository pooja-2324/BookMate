import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import morgan from "morgan"
import session from "express-session"
import path from "path"
import { fileURLToPath } from 'url'
import { checkSchema } from "express-validator"

import configureDB from "./config/db.js"

configureDB()
dotenv.config()

import { AuthenticateUser } from "./App/middleware/authentication.js"
import {AuthorizeUser} from "./App/middleware/authorizeUser.js"
import { AccountStatus } from "./App/middleware/checkAccountStatus.js"
import upload from "./App/middleware/multer.js"

import userCtrl from "./App/controller/userCtrl.js"
import vendorCtrl from "./App/controller/vendorCtrl.js"
import bookCtrl from "./App/controller/bookCtrl.js"
import rentCtrl from "./App/controller/rentCtrl.js"
import reviewCtrl from "./App/controller/reviewCtrl.js"
import clientCtrl from "./App/controller/clientCtrl.js"
import buyCtrl from "./App/controller/buyCtrl.js"

import { userRegisterSchema } from "./App/validations/user-Validation.js"
import { userLoginSchema } from "./App/validations/user-Validation.js"
import { getOtpSchema } from "./App/validations/user-Validation.js"
import { verifyOtpSchema } from "./App/validations/user-Validation.js"

import { idValidationSchema } from "./App/validations/idValidationSchema.js"
import { bookCreateSchema, bookUpdateSchema } from "./App/validations/book-validation.js"

import { rentDetailsSchema } from "./App/validations/rent-Validation.js"
import { buyValidationSchema } from "./App/validations/buyValidation.js"
import cartCtrl from "./App/controller/cartCtrl.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express()
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(session({
    secret:process.env.SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));
app.get('/api/user/count',userCtrl.count)
app.post('/api/user/register',checkSchema(userRegisterSchema),userCtrl.register)
app.post('/api/user/login',checkSchema(userLoginSchema),userCtrl.login)
app.post('/api/user/getOtp',checkSchema(getOtpSchema),userCtrl.getOtp)
app.post('/api/user/verifyOtp',checkSchema(verifyOtpSchema),userCtrl.verifyOtp)
app.get('/api/user/account',AuthenticateUser,userCtrl.account)
app.post('/api/user/profilepic',AuthenticateUser,upload.single('profilePic'),userCtrl.updateProfilePic)

app.get('/api/client/allClients',clientCtrl.allClients)
app.get('/api/book/clientCounts',AuthenticateUser,AuthorizeUser(['vendor']),clientCtrl.getClientsUsingBooks)
app.get('/api/client/:id',AuthenticateUser,clientCtrl.oneClient)

app.get('/api/vendor/allVendors',AuthenticateUser,AuthorizeUser(['admin']),vendorCtrl.allVendors)
app.get('/api/vendor/earnings',AuthenticateUser,AuthorizeUser(['vendor']),vendorCtrl.earnings)
app.get('/api/vendor/:id',AuthenticateUser,AuthorizeUser(['admin']),vendorCtrl.oneVendor)

app.post('/api/book/create',AuthenticateUser,AuthorizeUser(['vendor']),checkSchema(bookCreateSchema),checkSchema(AccountStatus),bookCtrl.create)
app.get('/api/book/myBook',AuthenticateUser,AuthorizeUser(['vendor','admin']),bookCtrl.myBooks)
app.get('/api/book/allBooks',AuthenticateUser,AuthorizeUser(['admin']),bookCtrl.allBooks)
app.get('/api/book/verified',bookCtrl.verified)
app.put('/api/book/:id/update',AuthenticateUser,AuthorizeUser(['vendor']),checkSchema(bookUpdateSchema),checkSchema(idValidationSchema),bookCtrl.update)
app.delete('/api/book/:id/delete',AuthenticateUser,AuthorizeUser(['vendor','admin']),checkSchema(idValidationSchema),bookCtrl.withdraw)
app.put('/api/book/:id/verify',AuthenticateUser,AuthorizeUser(['admin']),checkSchema(idValidationSchema),bookCtrl.verify)
app.get('/api/book/:id',bookCtrl.oneBook)
app.get('/api/vendor/:vid/book/:bid',AuthenticateUser,AuthorizeUser(['admin']),checkSchema(idValidationSchema),bookCtrl.specific)


app.post('/api/book/:bid/rent/create',AuthenticateUser,AuthorizeUser(['vendor']),checkSchema(rentDetailsSchema),rentCtrl.details)
app.get('/api/rent/active',AuthenticateUser,AuthorizeUser(['vendor','admin']),rentCtrl.active)
app.get('/api/book/:bid/rent',AuthenticateUser,AuthorizeUser(['admin','vendor','client']),rentCtrl.rentDetails)
app.put('/api/rent/placeOrder',AuthenticateUser,AuthorizeUser(['client']),rentCtrl.placeOrder)
app.put('/api/rent/:bid/return',AuthenticateUser,AuthorizeUser(['client']),rentCtrl.return)
app.put('/api/rent/:id/update',AuthenticateUser,rentCtrl.update)

app.post('/api/review/create', AuthenticateUser, reviewCtrl.create)
app.get('/api/review/:bid',AuthenticateUser,AuthorizeUser(['client']),reviewCtrl.getBook)

app.get('/api/cart/all',AuthenticateUser,AuthorizeUser(['client']),cartCtrl.listAll)
app.post('/api/add/:bid/cart',AuthenticateUser,AuthorizeUser(['client']),cartCtrl.addToCart)
app.delete('/api/cart/clear',AuthenticateUser,AuthorizeUser(['client']),cartCtrl.clear)
app.delete('/api/cart/:id/remove',AuthenticateUser,AuthorizeUser(['client']),cartCtrl.remove)

app.post('/api/buy/create',AuthenticateUser,AuthorizeUser(['vendor']),checkSchema(buyValidationSchema),buyCtrl.details)
app.put('/api/buy/:bid/placeOrder',AuthenticateUser,AuthorizeUser(['client']),buyCtrl.placeOrder)

app.listen(process.env.PORT,()=>{
    console.log('server is listening on port',process.env.PORT)
})