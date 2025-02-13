import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadRentDetails, updateRentDetails } from '../slices/rentSlice';

export default function RentDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bid } = useParams();
    const { rentData, editId } = useSelector(state => state.rents);
    
    const formInitialValue = {
        period: '',
        pricing: {
            cautionDeposit: '',
            readingFee: '',
            deliveryFee: '',
            platformFee: ''
        }
    };
    
    const [form, setForm] = useState(formInitialValue);
    
    useEffect(() => {
        if (editId) {
            const rent = rentData.find(ele => ele._id == editId);
            setForm({ ...rent });
        }
    }, [editId]);
    
    const resetForm = () => {
        setForm(formInitialValue);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!editId) {
            dispatch(uploadRentDetails({ bid, form, resetForm })).then(() => {
                navigate('/vhome');
            });
        } else {
            dispatch(updateRentDetails({ id: editId, form, resetForm })).then(() => {
                navigate(`/book/${bid}/rent`);
            });
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit' : 'Create'} Rent Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type='number' value={form?.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder='Enter period' className="w-full p-2 border rounded" />
                
                <input type='number' value={form.pricing?.cautionDeposit} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, cautionDeposit: e.target.value } })} placeholder='Enter Caution Deposit' className="w-full p-2 border rounded" />
                
                <input type='number' value={form.pricing?.deliveryFee} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, deliveryFee: e.target.value } })} placeholder='Enter Delivery Fee' className="w-full p-2 border rounded" />
                
                <input type='number' value={form.pricing?.platformFee} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, platformFee: e.target.value } })} placeholder='Enter Platform Fee' className="w-full p-2 border rounded" />
                
                <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
                    {editId ? 'Update' : 'Create'}
                </button>
            </form>
        </div>
    );
}
