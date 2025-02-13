import { useContext } from "react";
import AuthContext from "../context/authContext";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute(props){
 
    const location=useLocation()
    const {userState}=useContext(AuthContext)
    if(!localStorage.getItem('token')&&!userState.isLoggedIn){
        return <Navigate to='/login' state={{form:location}}/>
    }else if(props.permittedRoles&&props.permittedRoles.includes(userState.user.role)){
        return props.children
    }else if(props.permittedRoles&&!props.permittedRoles.includes(userState.user.role)){
        return <p>Unauthorized</p>
    }else if(userState.isLoggedIn){
        return props.children
    }else{
        return <Navigate to='/login' replace/>
    }
}