import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './components/Auth-provider';

import App from './App';
import './index.css'
import {Provider} from 'react-redux'
import store from './store'

console.log('store',store.getState())
store.subscribe(()=>{
    console.log("state get updated",store.getState())
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <BrowserRouter>
    <Provider store={store}>
    <AuthProvider>
        <App />
    </AuthProvider>
    </Provider>
 </BrowserRouter>
   
  
);


