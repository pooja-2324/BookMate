// import { useNavigate } from 'react-router-dom'
// import axios from '../config/axios'
// import { useEffect, useState } from "react"
// export default function Register(){
//     const navigate=useNavigate()
//     const formInitialValue={
//         name:"",
//         email:"",
//         password:"",
//         phone:"",
//         role:"",
//         location:{
//             city:"",
//             state:""
//         }
//     }
//     const[count,setCount]=useState(0)
//     const [form,setForm]=useState(formInitialValue)
//     const [clientError,setClientError]=useState({})
//     const [serverError,setServerError]=useState([])
//     const errors={}
//     const runClientValidation=()=>{
//         if(form.name.trim().length==0){
//             errors.name='*name is required'
//         }
//         if(form.email.trim().length==0){
//             errors.email='*email is required'
//         }
//         if(form.password.trim().length==0){
//             errors.password='*password is required'
//         }
//         if(form.phone.trim().length==0){
//             errors.phone='*phone number is required'
//         }
//         if(form.location.state.trim().length==0){
//             errors.state="*state is required"
//         }
//         if(form.location.city.trim().length==0){
//             errors.city="*city is required"
//         }
//     }
//     useEffect(()=>{
//         (async()=>{
//             try{
//                 const response=await axios.get('/api/user/count')
//                 console.log('count',response.data.count)
//                 setCount(response.data.count)
//             }catch(err){
//                 console.log(err)
//             }
//         })()
//     },[])
//     const handleSubmit=async(e)=>{
//         e.preventDefault()
//         runClientValidation()
//         if(Object.keys(errors).length==0){
//             try{
//                 const responses=await axios.post('/api/user/register',form)
//                 console.log('registered user',responses.data)
//                 setForm(formInitialValue)
//                 navigate('/login')
//             }catch(err){
//                 console.log(err.response.data.errors)
//                 setServerError(err.response.data.errors)
    
//             }
//         }else{
//             setClientError(errors)
//         }
        

//     }
   

//     return (
//         <div>
//             <h2>Register Here..!</h2>
//             <ul>{serverError&&serverError.map(ele=><li style={{color:"red",fontSize:"15px"}}><i>{ele.msg}</i></li>)}</ul>
//             <form onSubmit={handleSubmit}>
//                 <input type="text"
//                 value={form.name}
//                 onChange={(e)=>setForm({...form,name:e.target.value})}
//                 placeholder="Enter your name"/> <br/>
//                 {clientError.name&&<i style={{color:"red",fontSize:'13px'}}>{clientError.name}</i>}<br/>

//                 <input type="email"
//                 value={form.email}
//                 onChange={(e)=>setForm({...form,email:e.target.value})}
//                 placeholder="Enter your email"/><br/>
//                 {clientError.email&&<i style={{color:"red",fontSize:'13px'}}>{clientError.email}</i>}<br/>

               

//                 <input type="password"
//                 value={form.password}
//                 onChange={(e)=>{setForm({...form,password:e.target.value})}}
//                 placeholder="Enter your password"/><br/>
//                 {clientError.password&&<i style={{color:"red",fontSize:'13px'}}>{clientError.password}</i>}<br/>
//                 {count>0&&(
//                      <>
//                      <input type="text"
//                      value={form.phone}
//                      onChange={(e)=>setForm({...form,phone:e.target.value})}
//                      placeholder="Enter your phone Number"/><br/>
//                      {clientError.phone&&<i  style={{color:"red",fontSize:'13px'}}>{clientError.phone}</i>}<br/>
                     
//                     <input
//                     type="text"
//                     value={form.location.city}
//                     onChange={(e) => setForm({ ...form, location: { ...form.location, city: e.target.value } })}
//                     placeholder="Enter your city"/><br/>
//                     {clientError.city&&<i  style={{color:"red",fontSize:'13px'}}>{clientError.city}</i>}
//                 <br/>
               
//                 <input
//                     type="text"
//                     value={form.location.state}
//                     onChange={(e) => setForm({ ...form, location: { ...form.location, state: e.target.value } })}
//                     placeholder="Enter your state"
//                 /><br/>
//                 {clientError.state&&<i  style={{color:"red",fontSize:'13px'}}>{clientError.state}</i>}<br/>
                
            

//             <label> I'm a vendor</label>
//             <input type='radio'
//             value="vendor"
//             onChange={(e)=>setForm({...form,role:e.target.value})}
//             name="role"/>

//             <label>I'm a Client</label>
//             <input type='radio'
//             value="client"
//             onChange={(e)=>setForm({...form,role:e.target.value})}
//             name="role"/>
//             <br/>
//                      </>

//                 )}
                    
//                 <input type="Submit"
//                 value="Register"/>
//             </form>
//         </div>
//     )
// }
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { useEffect, useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const formInitialValue = {
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    location: {
      city: "",
      state: "",
    },
  };

  const [count, setCount] = useState(0);
  const [form, setForm] = useState(formInitialValue);
  const [clientError, setClientError] = useState({});
  const [serverError, setServerError] = useState([]);
  const errors = {};

  const runClientValidation = () => {
    if (form.name.trim().length === 0) {
      errors.name = "*Name is required";
    }
    if (form.email.trim().length === 0) {
      errors.email = "*Email is required";
    }
    if (form.password.trim().length === 0) {
      errors.password = "*Password is required";
    }
    if (form.phone.trim().length === 0) {
      errors.phone = "*Phone number is required";
    }
    if (form.location.state.trim().length === 0) {
      errors.state = "*State is required";
    }
    if (form.location.city.trim().length === 0) {
      errors.city = "*City is required";
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/user/count");
        console.log("count", response.data.count);
        setCount(response.data.count);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    runClientValidation();
    if (Object.keys(errors).length === 0) {
      try {
        const responses = await axios.post("/api/user/register", form);
        console.log("registered user", responses.data);
        setForm(formInitialValue);
        navigate("/login");
      } catch (err) {
        console.log(err.response.data.errors);
        setServerError(err.response.data.errors);
      }
    } else {
      setClientError(errors);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="w-full bg-orange-500 text-white p-4 text-center flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold">Bookmate</h1>
        <Link to='/login'>Login</Link>
      </header>

      {/* Registration Form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Register
          </h2>

          {serverError.length > 0 && (
            <ul className="mb-4 text-red-500 text-sm">
              {serverError.map((ele, index) => (
                <li key={index}>{ele.msg}</li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {clientError.name && (
                <p className="text-red-500 text-sm mt-1">{clientError.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {clientError.email && (
                <p className="text-red-500 text-sm mt-1">{clientError.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {clientError.password && (
                <p className="text-red-500 text-sm mt-1">
                  {clientError.password}
                </p>
              )}
            </div>

            {count > 0 && (
              <>
                <div>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {clientError.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {clientError.phone}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={form.location.city}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location: { ...form.location, city: e.target.value },
                      })
                    }
                    placeholder="Enter your city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {clientError.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {clientError.city}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={form.location.state}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location: { ...form.location, state: e.target.value },
                      })
                    }
                    placeholder="Enter your state"
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {clientError.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {clientError.state}
                    </p>
                  )}
                </div>

                {/* Role Selection */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="vendor"
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      name="role"
                      className="mr-2"
                    />
                    I'm a Vendor
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="client"
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      name="role"
                      className="mr-2"
                    />
                    I'm a Client
                  </label>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Register
            </button>
          </form>
        </div>
      </div>
      <footer className="w-full bg-gray-800 text-white p-4 text-center">
  <p>&copy; 2025 Bookmate. All rights reserved.</p>
</footer>
    </div>
  );
}
