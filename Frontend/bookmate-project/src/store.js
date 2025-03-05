import { configureStore } from "@reduxjs/toolkit";
import booksReducer from './slices/bookSlice'
import rentReducer from './slices/rentSlice'
import cartReducer from './slices/cartSlice'
import clientReducer from './slices/clientSlice'
import reviewReducer from './slices/reviewSlice'
import orderReducer from './slices/orderSlice'
import buyReducer from './slices/buySlice'
import paymentReducer from './slices/paymentSlice'
import adminReducer from './slices/adminSlice'
import vendorReducer from './slices/vendorSlice'
const store=configureStore({
    reducer:{
        books:booksReducer,
        rents:rentReducer,
        carts:cartReducer,
        clients:clientReducer,
        reviews:reviewReducer,
        orders:orderReducer,
        buys:buyReducer,
        payments:paymentReducer,
        admin:adminReducer,
        vendors:vendorReducer

    }
})
export default store