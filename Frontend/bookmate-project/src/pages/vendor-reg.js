import {useState} from 'react'
export default function VendorReg(){
    const formInitialValue={
        name:"",
        email:"",
        phone:"+91",
        password:"",
        role:""
    }
    const [form,setForm]=useState(formInitialValue)
    return(
        <div>
            <h2>Upload your BOOKS here...!</h2>
            <form>
                <input type='text'
                value={form.name}
                onChange={(e)=>setForm({...form,name:e.target.value})}
                placeholder='Enter your name ..'/><br/>

                <input type='email'
                value={form.email}
                onChange={(e)=>setForm({...form,email:e.target.value})}
                placeholder='Enter your email'/><br/>

                <input type='text'
                value={form.phone}
                onChange={(e)=>setForm({...form,phone:e.target.value})}
                placeholder='Enter your phone Number'/><br/>

                <input type='password'
                value={form.password}
                onChange={(e)=>setForm({...form,password:e.target.value})}
                placeholder='Enetr your password'/><br/>

                <input type='radio'
                />
            </form>
        </div>
    )
}