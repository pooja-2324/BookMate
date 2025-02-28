import { useSelector, useDispatch } from 'react-redux';
import { useContext, useEffect, useState } from 'react';
import { currentRentBooks, toDelivered } from '../slices/rentSlice';
import { currentPurchasedBooks, SaleToDelivered } from '../slices/buySlice';
import {AiOutlineUpload,AiOutlineLogout,AiOutlineUser} from 'react-icons/ai'
import {Link,useNavigate} from 'react-router-dom'
import AuthContext from '../context/authContext';
export default function CurrentBooks() {
    const {handleLogout}=useContext(AuthContext)
    const navigate=useNavigate()
    const [initialRentData, setInitialRentData] = useState([]);
    const [initialSellData, setInitialSellData] = useState([]);
    const dispatch = useDispatch();
    const { rentData } = useSelector(state => state.rents);
    const { buyData } = useSelector(state => state.buys);

    useEffect(() => {
        // Fetch rented books
        dispatch(currentRentBooks()).then((action) => {
            if (action.payload) {
                setInitialRentData(action.payload); // Store the initial rentData
            }
        });

        // Fetch purchased books
        dispatch(currentPurchasedBooks()).then((action) => {
            if (action.payload) {
                setInitialSellData(action.payload); // Store the initial sellData
            }
        });
    }, [dispatch]);

    const handleDeliver = (id) => {
        const rent = initialRentData.find(ele => ele._id === id);
        const confirm = window.confirm(`The ${rent.book?.modifiedTitle} is delivered to ${rent.client?.name}`);
        if (confirm) {
            dispatch(toDelivered(id)).then(() => {
                // Remove the delivered item from the state
                setInitialRentData(prevData => prevData.filter(ele => ele._id !== id));
            });
        }
    };

    const handleDeliverSale = (id) => {
        const sale = initialSellData.find(ele => ele._id === id);
        const confirm = window.confirm(`The ${sale?.book?.modifiedTitle} is delivered to ${sale?.client?.name}`);
        if (confirm) {
            dispatch(SaleToDelivered(id)).then(() => {
                // Remove the delivered item from the state
                setInitialSellData(prevData => prevData.filter(ele => ele._id !== id));
            });
        }
    };

    console.log('initialRent', initialRentData);
    console.log('rentData', rentData);
    console.log('initialSell', initialSellData);
    console.log('buyData', buyData);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
             <header className="w-full h-14 bg-red-700 text-white p-4 flex justify-between items-center px-6 left-0 top-0">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Bookmate</h1>
                <nav>
                  <ul className="flex space-x-4 items-center">
                    <li>
                      <Link to="/profile">
                        <AiOutlineUser size={24} /> Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => navigate("/upload")}
                        className="text-white px-4 py-2 rounded-md hover:bg-red-500"
                      >
                        <AiOutlineUpload size={24}/>
                        Upload Book
                      </button>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="hover:underline">
                        <AiOutlineLogout size={24} />
                        Log Out
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Current Books</h3>

            {/* Rented Books Table */}
            <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4 text-gray-700">Rented Books</h4>
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Book
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rent Starts on
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rent Ends On
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {initialRentData?.map(ele => (
                                <tr key={ele._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ele.book?.modifiedTitle}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ele.client?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ele.rentalStartDate.split('T')[0]}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ele.dueDate.split('T')[0]}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ele.period}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => handleDeliver(ele._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                        >
                                            Deliver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Purchased Books Table */}
            <div>
                <h4 className="text-xl font-semibold mb-4 text-gray-700">Purchased Books</h4>
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Book
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {initialSellData?.map(ele => (
                                <tr key={ele._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ele.book?.modifiedTitle}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ele.client?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => handleDeliverSale(ele._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                        >
                                            Deliver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}