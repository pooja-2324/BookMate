// import express from "express"
// import dotenv from 'dotenv'
// import cors from "cors"
// import morgan from "morgan"
// import session from "express-session"
// import path from "path"
// import cookieParser from "cookie-parser";
// import { fileURLToPath } from 'url'
// import { checkSchema } from "express-validator"

// import configureDB from "./config/db.js"
// import passport from "./config/passport.js"
// configureDB()
// dotenv.config()

// import { AuthenticateUser } from "./App/middleware/authentication.js"
// import {AuthorizeUser} from "./App/middleware/authorizeUser.js"
// import { AccountStatus } from "./App/middleware/checkAccountStatus.js"
// import upload from "./App/middleware/multer.js"

// import userCtrl from "./App/controller/userCtrl.js"
// import vendorCtrl from "./App/controller/vendorCtrl.js"
// import bookCtrl from "./App/controller/bookCtrl.js"
// import rentCtrl from "./App/controller/rentCtrl.js"
// import reviewCtrl from "./App/controller/reviewCtrl.js"
// import clientCtrl from "./App/controller/clientCtrl.js"
// import buyCtrl from "./App/controller/buyCtrl.js"
// import orderCtrl from "./App/controller/orderCtrl.js"

// import { userRegisterSchema } from "./App/validations/user-Validation.js"
// import { userLoginSchema } from "./App/validations/user-Validation.js"
// import { getOtpSchema } from "./App/validations/user-Validation.js"
// import { verifyOtpSchema } from "./App/validations/user-Validation.js"

// import { idValidationSchema } from "./App/validations/idValidationSchema.js"
// import { bookCreateSchema, bookUpdateSchema } from "./App/validations/book-validation.js"

// import { rentDetailsSchema } from "./App/validations/rent-Validation.js"
// import { buyValidationSchema } from "./App/validations/buyValidation.js"
// import cartCtrl from "./App/controller/cartCtrl.js"

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);



// const app=express()
// app.use(cors({
//     origin: "http://localhost:3000", // Change to your frontend URL
//     credentials: true, // ✅ Allow session cookies
// }))


// app.use(express.json())
// app.use(passport.initialize())
// app.use(passport.session())

// app.use(morgan('tiny'))
// app.use(express.static(path.join(__dirname, 'uploads')));
// app.use(session({
//     secret:process.env.SECRET, 
    
//     cookie: { secure: false } 
// }));


// app.get('/api/user/count',userCtrl.count)
// app.post('/api/user/register',checkSchema(userRegisterSchema),userCtrl.register)
// app.post('/api/user/login',checkSchema(userLoginSchema),userCtrl.login)
// app.post('/api/user/getOtp',userCtrl.getOtp)
// app.post('/api/user/verifyOtp',userCtrl.verifyOtp)

// app.get('/api/user/account',AuthenticateUser,userCtrl.account)
// app.post('/api/user/profilepic',AuthenticateUser,upload.single('profilePic'),userCtrl.updateProfilePic)
// // app.get('/auth/google', (req, res, next) => {
// //     req.session.role = req.query.role || "client"; // Store role in session
// //     passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
// // });

// // app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
// //     res.redirect('/'); // Redirect to dashboard after login
// // });

// app.get('/api/client/allClients',clientCtrl.allClients)
// app.get('/api/client/book/rentDetails',AuthenticateUser,AuthorizeUser(['vendor']),clientCtrl.bookClientRentDetails)
// app.get('/api/book/clientCounts',AuthenticateUser,AuthorizeUser(['vendor']),clientCtrl.getClientsUsingBooks)
// app.get('/api/client/:id',AuthenticateUser,clientCtrl.oneClient)

// app.get('/api/vendor/allVendors',AuthenticateUser,AuthorizeUser(['admin']),vendorCtrl.allVendors)
// app.get('/api/vendor/earnings',AuthenticateUser,AuthorizeUser(['vendor']),vendorCtrl.earnings)
// app.get('/api/vendor/:id',AuthenticateUser,AuthorizeUser(['admin']),vendorCtrl.oneVendor)

// app.post('/api/book/create',AuthenticateUser,AuthorizeUser(['vendor']),checkSchema(bookCreateSchema),checkSchema(AccountStatus),bookCtrl.create)
// app.get('/api/book/myBook',AuthenticateUser,AuthorizeUser(['vendor','admin']),bookCtrl.myBooks)
// app.get('/api/book/allBooks',AuthenticateUser,AuthorizeUser(['admin']),bookCtrl.allBooks)
// app.get('/api/book/verified',bookCtrl.verified)
// app.put('/api/book/:id/update',AuthenticateUser,AuthorizeUser(['vendor']),checkSchema(bookUpdateSchema),checkSchema(idValidationSchema),bookCtrl.update)
// app.delete('/api/book/:id/delete',AuthenticateUser,AuthorizeUser(['vendor','admin']),checkSchema(idValidationSchema),bookCtrl.withdraw)
// app.put('/api/book/:id/verify',AuthenticateUser,AuthorizeUser(['admin']),checkSchema(idValidationSchema),bookCtrl.verify)
// app.get('/api/book/:id',bookCtrl.oneBook)
// app.get('/api/vendor/:vid/book/:bid',AuthenticateUser,AuthorizeUser(['admin']),checkSchema(idValidationSchema),bookCtrl.specific)


// app.post('/api/book/:bid/rent/create',AuthenticateUser,AuthorizeUser(['vendor']),checkSchema(rentDetailsSchema),rentCtrl.details)
// app.get('/api/rent/active',AuthenticateUser,AuthorizeUser(['vendor','admin']),rentCtrl.active)
// app.get('/api/book/:bid/rent',AuthenticateUser,AuthorizeUser(['admin','vendor','client']),rentCtrl.rentDetails)
// app.put('/api/rent/placeOrder',AuthenticateUser,AuthorizeUser(['client']),rentCtrl.bothPlaceOrder)
// app.put('/api/rent/:bid/return',AuthenticateUser,AuthorizeUser(['client']),rentCtrl.return)
// app.put('/api/rent/:id/update',AuthenticateUser,rentCtrl.update)
// app.put('/api/rent/:bid/placeSingleOrder',AuthenticateUser,AuthorizeUser(['client']),rentCtrl.placeSingleOrder)

// app.post('/api/review/create', AuthenticateUser, reviewCtrl.create)
// app.get('/api/review/:bid',AuthenticateUser,AuthorizeUser(['client']),reviewCtrl.getBook)

// app.get('/api/cart/all',AuthenticateUser,AuthorizeUser(['client']),cartCtrl.listAll)
// app.post('/api/add/:bid/cart',AuthenticateUser,AuthorizeUser(['client']),cartCtrl.addToCart)
// app.delete('/api/cart/clear',AuthenticateUser,AuthorizeUser(['client']),cartCtrl.clear)
// app.delete('/api/cart/:id/remove',AuthenticateUser,AuthorizeUser(['client']),cartCtrl.remove)

// app.post('/api/buy/:bid/create',AuthenticateUser,AuthorizeUser(['vendor']),checkSchema(buyValidationSchema),buyCtrl.details)
// app.put('/api/buy/:bid/placeOrder',AuthenticateUser,AuthorizeUser(['client']),buyCtrl.placeOrder)

// app.get('/api/order/my',AuthenticateUser,AuthorizeUser(['client']),orderCtrl.myOrders)

// app.listen(process.env.PORT,()=>{
//     console.log('server is listening on port',process.env.PORT)
// })
import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { checkSchema } from "express-validator";
import cron from 'node-cron'

import configureDB from "./config/db.js";
import passport from "./config/passport.js";
configureDB();
dotenv.config();

import { AuthenticateUser } from "./App/middleware/authentication.js";
import { AuthorizeUser } from "./App/middleware/authorizeUser.js";
import { AccountStatus } from "./App/middleware/checkAccountStatus.js";
import upload from "./App/middleware/multer.js";

import userCtrl from "./App/controller/userCtrl.js";
import vendorCtrl from "./App/controller/vendorCtrl.js";
import bookCtrl from "./App/controller/bookCtrl.js";
import rentCtrl from "./App/controller/rentCtrl.js";
import reviewCtrl from "./App/controller/reviewCtrl.js";
import clientCtrl from "./App/controller/clientCtrl.js";
import buyCtrl from "./App/controller/buyCtrl.js";
import orderCtrl from "./App/controller/orderCtrl.js";
import cartCtrl from "./App/controller/cartCtrl.js";

import { userRegisterSchema } from "./App/validations/user-Validation.js";
import { userLoginSchema } from "./App/validations/user-Validation.js";
import { getOtpSchema } from "./App/validations/user-Validation.js";
import { verifyOtpSchema } from "./App/validations/user-Validation.js";
import { idValidationSchema } from "./App/validations/idValidationSchema.js";
import { bookCreateSchema, bookUpdateSchema } from "./App/validations/book-validation.js";
import { rentDetailsSchema } from "./App/validations/rent-Validation.js";
import { buyValidationSchema } from "./App/validations/buyValidation.js";
import { notifyDueDates } from "./App/controller/rentCtrl.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000", // Change to your frontend URL
    credentials: true, // Allow session cookies
}));
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());

// Session Configuration
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// cron.schedule("0 0 * * *", () => {
//     console.log("Checking due dates and sending notifications...");
//     checkDueDatesAndNotify();
//   });
  cron.schedule("0 0 * * * *", async() => {
    console.log("Test cron running every 5 seconds");
    notifyDueDates();
});


// Routes
app.get('/api/user/count', userCtrl.count);
app.post('/api/user/register', checkSchema(userRegisterSchema), userCtrl.register);
app.post('/api/user/login', checkSchema(userLoginSchema), userCtrl.login);
app.post('/api/user/getOtp', userCtrl.getOtp);
app.post('/api/user/verifyOtp', userCtrl.verifyOtp);

app.get('/api/user/account', AuthenticateUser, userCtrl.account);
app.post('/api/user/profilePic', AuthenticateUser, upload.single('profilePic'), userCtrl.updateProfilePic);
app.put('/api/user/update',AuthenticateUser,userCtrl.update)

// Google OAuth Routes
app.get('/auth/google', (req, res, next) => {
    req.session.role = req.query.role || "client"; // Store role in session
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/'); // Redirect to dashboard after login
});

// Other routes...
app.get('/api/client/allClients', clientCtrl.allClients);
app.get('/api/client/book/rentDetails', AuthenticateUser, AuthorizeUser(['vendor']), clientCtrl.bookClientRentDetails);
app.get('/api/book/clientCounts', AuthenticateUser, AuthorizeUser(['vendor']), clientCtrl.getClientsUsingBooks);
app.get('/api/client/:id', AuthenticateUser, clientCtrl.oneClient);

app.get('/api/vendor/allVendors', AuthenticateUser, AuthorizeUser(['admin']), vendorCtrl.allVendors);
app.get('/api/vendor/earnings', AuthenticateUser, AuthorizeUser(['vendor']), vendorCtrl.earnings);
app.get('/api/vendor/:id', AuthenticateUser, AuthorizeUser(['admin']), vendorCtrl.oneVendor);

app.post('/api/book/create', AuthenticateUser, AuthorizeUser(['vendor']), checkSchema(bookCreateSchema), checkSchema(AccountStatus), bookCtrl.create);
app.get('/api/book/myBook', AuthenticateUser, AuthorizeUser(['vendor', 'admin']), bookCtrl.myBooks);
app.get('/api/book/allBooks', AuthenticateUser, AuthorizeUser(['admin']), bookCtrl.allBooks);
app.get('/api/book/verified', bookCtrl.verified);
app.put('/api/book/:id/update', AuthenticateUser, AuthorizeUser(['vendor']), checkSchema(bookUpdateSchema), checkSchema(idValidationSchema), bookCtrl.update);
app.delete('/api/book/:id/delete', AuthenticateUser, AuthorizeUser(['vendor', 'admin']), checkSchema(idValidationSchema), bookCtrl.withdraw);
app.put('/api/book/:id/verify', AuthenticateUser, AuthorizeUser(['admin']), checkSchema(idValidationSchema), bookCtrl.verify);
app.get('/api/book/:id', bookCtrl.oneBook);
app.get('/api/vendor/:vid/book/:bid', AuthenticateUser, AuthorizeUser(['admin']), checkSchema(idValidationSchema), bookCtrl.specific);

app.post('/api/book/:bid/rent/create', AuthenticateUser, AuthorizeUser(['vendor']), checkSchema(rentDetailsSchema), rentCtrl.details);
app.get('/api/rent/active', AuthenticateUser, AuthorizeUser(['vendor', 'admin']), rentCtrl.active);
app.get('/api/book/:bid/rent', AuthenticateUser, AuthorizeUser(['admin', 'vendor', 'client']), rentCtrl.rentDetails);
app.put('/api/rent/placeOrder', AuthenticateUser, AuthorizeUser(['client']), rentCtrl.bothPlaceOrder);
app.put('/api/rent/:bid/return', AuthenticateUser, AuthorizeUser(['client']), rentCtrl.return);
app.put('/api/rent/:id/update', AuthenticateUser, rentCtrl.update);
app.put('/api/rent/:bid/placeSingleOrder', AuthenticateUser, AuthorizeUser(['client']), rentCtrl.placeSingleOrder);
app.get('/api/rent/orderPlaced',AuthenticateUser,AuthorizeUser(['vendor']),rentCtrl.orderPlaced)
app.put('/api/rent/:id/toDelivered',AuthenticateUser,AuthorizeUser(['vendor']),rentCtrl.toDelivered)

app.post('/api/review/create', AuthenticateUser, reviewCtrl.create);
app.get('/api/review/:bid', AuthenticateUser, AuthorizeUser(['client']), reviewCtrl.getBook);
app.get('/api/review/:rid',AuthenticateUser,reviewCtrl.getReview)
app.post('/api/review/:rid/upload',AuthenticateUser,AuthorizeUser(['client']),upload.array('photo',5),reviewCtrl.upload)


app.get('/api/cart/all', AuthenticateUser, AuthorizeUser(['client']), cartCtrl.listAll);
app.post('/api/add/:bid/cart', AuthenticateUser, AuthorizeUser(['client']), cartCtrl.addToCart);
app.delete('/api/cart/clear', AuthenticateUser, AuthorizeUser(['client']), cartCtrl.clear);
app.delete('/api/cart/:id/remove', AuthenticateUser, AuthorizeUser(['client']), cartCtrl.remove);

app.post('/api/buy/:bid/create', AuthenticateUser, AuthorizeUser(['vendor']), checkSchema(buyValidationSchema), buyCtrl.details);
app.put('/api/buy/:bid/placeOrder', AuthenticateUser, AuthorizeUser(['client']), buyCtrl.placeOrder);
app.get('/api/buy/orderPlaced',AuthenticateUser,AuthorizeUser(['vendor']),buyCtrl.orderPlaced)
app.put('/api/buy/:id/toDelivered',AuthenticateUser,AuthorizeUser(['vendor']),buyCtrl.toDelivered)

app.get('/api/order/my', AuthenticateUser, AuthorizeUser(['client']), orderCtrl.myOrders);

// Start Server
app.listen(process.env.PORT, () => {
    console.log('server is listening on port', process.env.PORT);
});