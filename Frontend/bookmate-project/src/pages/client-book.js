import { fetchClientBookRentDetails } from "../slices/clientSlice"
import {useSelector,useDispatch} from 'react-redux'
import {useEffect,useContext} from 'react'
import AuthContext from "../context/authContext"
export default function ClientBook(){
    const {userState}=useContext(AuthContext)
    const dispatch=useDispatch()
    const {clientData}=useSelector(state=>state.clients)
    useEffect(()=>{
        dispatch(fetchClientBookRentDetails())
    },[dispatch])
    const flatData=clientData.flat()
    console.log('flatData',flatData)

    return (
        <div>
            <h2>Books-Client</h2>
            <table border='1'>
        <thead>
        <tr>
            
            <th>Client</th>
            <th>Book</th>
            <th>status</th>
            <th>StartDate</th>
            <th>DueDate</th>
            <th>ReturnedDate</th>
            <th>LateFee</th>
            <th>DamageFee</th>
            
        </tr>
        </thead>
        <tbody>
        {flatData.map((ele,i)=>(
            <tr key={ele._id}>
                 {ele.book?.vendor==userState.user._id?<>
                   
                    <td>{ele.rent?.client}</td>
                    <td>{ele.book?.modifiedTitle}</td>
                    <td>{ele.rent?.rentedBookStatus}</td>
                    <td>{ele.rent?.rentalStartDate.split('T')[0]}</td>
                    <td>{ele.rent?.dueDate.split('T')[0]}</td>
                    {ele.rent?.rentedBookStatus=='completed'?
                    <td>{ele.rent?.returnedDate.split('T')[0]}</td>:<p>Not returned</p>}
                    <td>{ele.rent?.lateFee}</td>
                    <td>{ele.rent?.damageFee}</td>


                 </>:<></>}
                
               
                
            </tr>
        ))}
        </tbody>
            </table>
        </div>
    )
}