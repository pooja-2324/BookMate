import { useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { useState } from "react"
export default function Register(){
    const navigate=useNavigate()
    const formInitialValue={
        name:"",
        email:"",
        password:"",
        role:""
    }
    const [form,setForm]=useState(formInitialValue)
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            const responses=await axios.post('/api/user/register',form)
            console.log('registered user',responses.data)
            setForm(formInitialValue)
            navigate('/login')
        }catch(err){
            console.log(err)

        }

    }

    return (
        <div>
            <h2>Register Here..!</h2>
            <form onSubmit={handleSubmit}>
                <input type="text"
                value={form.name}
                onChange={(e)=>setForm({...form,name:e.target.value})}
                placeholder="Enter your name"/> <br/>

                <input type="email"
                value={form.email}
                onChange={(e)=>setForm({...form,email:e.target.value})}
                placeholder="Enter your email"/><br/>

                <input type="password"
                value={form.password}
                onChange={(e)=>{setForm({...form,password:e.target.value})}}
                placeholder="Enter your password"/><br/>

                <label>vendor</label>
                <input type='radio'
                value="vendor"
                onChange={(e)=>setForm({...form,role:e.target.value})}
                name="role"/>

                <label>Client</label>
                <input type='radio'
                value="client"
                onChange={(e)=>setForm({...form,role:e.target.value})}
                name="role"/>
                <br/>

                <input type="Submit"/>
            </form>
        </div>
    )
}