import { format } from "date-fns";
import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { activeRent } from "../slices/rentSlice";
import { AiOutlineCheckSquare, AiOutlineUpload, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/authContext";

export default function DueDateCalendar() {
    const { handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { rentData } = useSelector((state) => state.rents);
    const [dueDates, setDueDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDateDetails, setSelectedDateDetails] = useState([]);

    useEffect(() => {
        dispatch(activeRent()).then(() => setLoading(false));
    }, [dispatch]);

    useEffect(() => {
        if (rentData?.length > 0) {
            setDueDates(
                rentData?.map((ele) => ({
                    date: format(new Date(ele.dueDate), "yyyy-MM-dd"),
                    clientName: ele.client?.name,
                    book: ele.book?.modifiedTitle,
                    rentalStartDate: ele.rentalStartDate,
                    dueDate: ele.dueDate,
                    period: ele.period,
                }))
            );
        }
    }, [rentData]);

    const handleDateClick = (date) => {
        const formattedDate = format(new Date(date), "yyyy-MM-dd");
        const details = rentData.filter(
            (ele) => format(new Date(ele.dueDate), "yyyy-MM-dd") === formattedDate
        );
        setSelectedDateDetails(details);
    };

    return (
        <div className="flex flex-col items-center bg-white p-6 shadow-lg rounded-lg w-full">
            <header className="w-full h-14 bg-red-700 text-white p-4 flex justify-between items-center px-6">
                <h1 className="text-2xl font-bold">Bookmate</h1>
                <nav>
                    <ul className="flex space-x-4 items-center">
                        <li><Link to="/profile"><AiOutlineUser size={24} /> Profile</Link></li>
                        <li><button onClick={() => navigate("/upload")} className="text-white px-4 py-2 rounded-md hover:bg-red-500"><AiOutlineUpload size={24}/> Upload Book</button></li>
                        <li><button onClick={handleLogout} className="hover:underline"><AiOutlineLogout size={24} /> Log Out</button></li>
                    </ul>
                </nav>
            </header>
            {/* <button
                onClick={()=>navigate(-1)}
                className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
                Back
            </button> */}
            <div className="flex flex-row w-full mt-6 space-x-6">
                {/* Calendar Section */}
                <div className="flex flex-col items-center w-1/2 p-6 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Due Date Calendar</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading due dates...</p>
                    ) : (
                        <Calendar
                            className="border border-gray-300 rounded-lg p-4 shadow-md w-full"
                            tileClassName={({ date }) => {
                                if (!date || isNaN(date.getTime())) return "";
                                const formattedDate = format(new Date(date), "yyyy-MM-dd");
                                return dueDates.some((ele) => ele.date === formattedDate)
                                    ? "bg-red-500 text-red rounded-full"
                                    : "";
                            }}
                            onClickDay={handleDateClick}
                        />
                    )}
                </div>

                {/* Rent Details Section */}
                <div className="w-1/2 p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Rent Details</h3>
                    {selectedDateDetails.length > 0 ? (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border p-2 text-left">Book</th>
                                    <th className="border p-2 text-left">Client</th>
                                    <th className="border p-2 text-left">Start Date</th>
                                    <th className="border p-2 text-left">Due Date</th>
                                    <th className="border p-2 text-left">Days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedDateDetails.map((ele, index) => (
                                    <tr key={index} className="hover:bg-gray-100 transition-all">
                                        <td className="border p-2">{ele.book?.modifiedTitle}</td>
                                        <td className="border p-2">{ele.client?.name}</td>
                                        <td className="border p-2">{format(new Date(ele.rentalStartDate), "yyyy-MM-dd")}</td>
                                        <td className="border p-2">{format(new Date(ele.dueDate), "yyyy-MM-dd")}</td>
                                        <td className="border p-2">{ele.period}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500">Select a date to view details</p>
                    )}
                </div>
            </div>
        </div>
    );
}
