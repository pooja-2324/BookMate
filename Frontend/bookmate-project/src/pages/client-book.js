import { fetchClientBookRentDetails } from "../slices/clientSlice";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useContext } from 'react';
import AuthContext from "../context/authContext";

export default function ClientBook() {
    const { userState } = useContext(AuthContext);
    const dispatch = useDispatch();
    const { clientData } = useSelector(state => state.clients);

    useEffect(() => {
        dispatch(fetchClientBookRentDetails());
    }, [dispatch]);

    const flatData = clientData.flat();
    console.log('flatData', flatData);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Books-Client</h2>
            <table className="min-w-full border border-red-600">
                <thead>
                    <tr className="bg-red-100">
                        <th className="border border-red-600 px-4 py-2 text-red-900">Client</th>
                        <th className="border border-red-600 px-4 py-2 text-red-900">Book</th>
                        <th className="border border-red-600 px-4 py-2 text-red-900">Status</th>
                        <th className="border border-red-600 px-4 py-2 text-red-900">StartDate</th>
                        <th className="border border-red-600 px-4 py-2 text-red-900">DueDate</th>
                        <th className="border border-red-600 px-4 py-2 text-red-900">ReturnedDate</th>
                        <th className="border border-red-600 px-4 py-2 text-red-900">LateFee</th>
                        <th className="border border-red-600 px-4 py-2 text-red-900">DamageFee</th>
                    </tr>
                </thead>
                <tbody>
                    {flatData.map((ele, i) => (
                        ele.book?.vendor === userState.user._id && (
                            <tr key={ele._id} className="hover:bg-red-50">
                                <td className="border border-red-600 px-4 py-2 text-red-900">{ele.rent?.client?.name}</td>
                                <td className="border border-red-600 px-4 py-2 text-red-900">{ele.book?.modifiedTitle}</td>
                                <td className="border border-red-600 px-4 py-2 text-red-900">{ele.rent?.rentedBookStatus}</td>
                                <td className="border border-red-600 px-4 py-2 text-red-900">{ele.rent?.rentalStartDate.split('T')[0]}</td>
                                <td className="border border-red-600 px-4 py-2 text-red-900">{ele.rent?.dueDate.split('T')[0]}</td>
                                <td className="border border-red-600 px-4 py-2 text-red-900">
                                    {ele.rent?.rentedBookStatus === 'completed' ? ele.rent?.returnedDate.split('T')[0] : <p className="text-red-500">Not returned</p>}
                                </td>
                                <td className="border border-red-600 px-4 py-2 text-red-900">{ele.rent?.lateFee}</td>
                                <td className="border border-red-600 px-4 py-2 text-red-900">{ele.rent?.damageFee}</td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
}