import {useSelector,useDispatch} from 'react-redux'
import {oneReview,reviewPhoto} from '../slices/reviewSlice'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
export default function ReviewPhotos(){
    const {reviewData}=useSelector(state=>state.reviews)
    const dispatch=useDispatch()
    const {rid}=useParams()
    useEffect(()=>{
        dispatch(oneReview(rid))
    },[dispatch],rid)
    const handleFileChange=()=>{

    }
    return(
        <div>
            <h3>Add photos</h3>
            <div className="mt-3">
               <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange()}
                className="hidden"
               
              />
              <label htmlFor={`file-input}`} className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer">
                Add Photos
              </label>
            </div>
        </div>

    )
}