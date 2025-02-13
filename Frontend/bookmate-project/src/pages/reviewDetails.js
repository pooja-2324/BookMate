import { getReviews } from "../slices/reviewSlice"
import { verifiedBooks } from "../slices/bookSlice"
import { useSelector,useDispatch } from "react-redux"
import { useEffect,useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {Rating,ThinStar} from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css';
export default function ReviewDetails(){
    const navigate=useNavigate()
    const {bid}=useParams()
    const dispatch=useDispatch()
    const {reviewData}=useSelector(state=>state.reviews)
    const {bookData}=useSelector(state=>state.books)
    const[bookRating,setBookrating]=useState(0)
    console.log('reviewData',reviewData)
    useEffect(()=>{
        dispatch(getReviews({bid}))
        dispatch(verifiedBooks())
    },[dispatch,bid])
    const oneBook=bookData.find(ele=>ele._id==bid)
    useEffect(() => {
        const average=reviewData?.map(ele=>ele.rating)
        if (average.length > 0) {
            const total = average.reduce((acc, cv) => acc + cv, 0);
            const avgRating = total / average.length;
            setBookrating(avgRating);
        } else {
            setBookrating(0);
        }
    }, [reviewData])
    console.log('reviewbook',oneBook)
    const handleRent=(id)=>{
        navigate(`/book/${id}/rentnow`)
    }
    const handleBuy=(id)=>{
        navigate(`/book/${id}/orderplacing`,{state:{price:oneBook.sellPrice,type:'buy'}})
    }
    return (
        <div>
            <h2>Book-Reviews</h2>
            <img style={{
                width: "160px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#FEF3C7"
            }}
            src={oneBook?.coverImage}/>
            <button onClick={()=>handleRent(oneBook._id)}>Rent Now</button>
            {oneBook.isSelling?<button onClick={()=>handleBuy(oneBook._id)}>Buy Now</button>:<></>}
            
             <h5>Product Details</h5>
             <h6>Rating-{bookRating}</h6>
             
             <Rating
                                    value={bookRating}
                                    itemShapes={ThinStar}
                                    readOnly // Make the rating read-only
                                    style={{ maxWidth: 100 ,marginLeft:'380px'}}
                                />
             <p>Author-{oneBook?.author}</p>
             <p>publishedYear-{oneBook?.publishedYear}</p>
             {oneBook?.genre?.length!==0?<p>Theme<br/>{oneBook?.genre?.join(' ,')}</p>:<></>}
                
             
             
             {oneBook?.pages?<p>Pages-{oneBook?.pages}</p>:<></>}
             
             <p>vendor-{oneBook?.vendor.name}</p>
            
             <hr/><hr/>
             
           <ul style={{listStyle:'none'}}> {reviewData?.map(ele=>(
            
           
            <li>
                <strong>{ele.reviewBy.name}</strong><br/>
                Posted on {ele.updatedAt.split('T')[0]}<br/>
                <img src= {ele.photo}/>
               <br/>
                {ele.reviewText}<br/>
                <div style={{marginLeft:'307px'}}>
                                <Rating
                                    value={ele.rating}
                                    itemShapes={ThinStar}
                                    readOnly // Make the rating read-only
                                    style={{ maxWidth: 100 }}
                                />
                                <div style={{backgroundColor:'green',width:'20px'}}>{ele.rating}</div>
                            </div>
               <hr/>
                </li>
            
           ))}</ul>

        </div>
    )
}