import { useEffect,useReducer } from "react";
import userReducer from "./userReducer";
import axios from '../config/axios'
import AuthContext from "../context/authContext";
const initialState={
    isLoggedIn:false,
    user:null
}
export default function AuthProvider(props){
    const [userState,userDispatch]=useReducer(userReducer,initialState)
    const handleLogin=(user)=>{
        userDispatch({type:'LOGIN',payload:{isLoggedIn:true,user:user}})
    }
    const handleLogout=()=>{
        userDispatch({type:'LOGOUT',payload:{isLoggedIn:false,user:null}})
    }
    const handleUpdate=(user)=>{
        userDispatch({type:'UPDATE_USER',payload:{isLoggedIn:true,user:user}})
    }
    useEffect(()=>{
        (async()=>{
            try{
                const response=await axios.get('/api/user/account',
                    {headers:{Authorization:localStorage.getItem('token')}}
                )
                handleLogin(response.data)
            }catch(err){
                localStorage.removeItem('token')
                console.log(err.response?.data?.error)
            }
        })()
    },[])
    if(localStorage.getItem('token')&&!userState.user){
        return <p>loading...</p>
    }
    
    return(
        <div>
            <AuthContext.Provider value={{handleLogin,handleLogout,userState,handleUpdate}}>
                {props.children}
            </AuthContext.Provider>
        </div>
    )
}