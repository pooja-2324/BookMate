import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import { checkSchema } from "express-validator"

import configureDB from "./config/db.js"

configureDB()
dotenv.config()

import { AuthenticateUser } from "./App/middleware/authentication.js"

import userCtrl from "./App/controller/userCtrl.js"

import { userRegisterSchema } from "./App/validations/user-Validation.js"

const app=express()
app.use(express.json())
app.use(cors())

app.post('/api/user/register',checkSchema(userRegisterSchema),userCtrl.register)
app.post('/api/user/login',userCtrl.login)
app.get('/api/user/account',AuthenticateUser,userCtrl.account)

app.listen(process.env.PORT,()=>{
    console.log('server is listening on port',process.env.PORT)
})