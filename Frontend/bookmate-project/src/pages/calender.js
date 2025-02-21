import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { activeRent } from "../slices/rentSlice";
import { AiOutlineCheckSquare } from "react-icons/ai";

export default function DueDateCalendar() {
    const dispatch = useDispatch();
    const { rentData } = useSelector((state) => state.rents);
    const [dueDates, setDueDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState(null);
    const [hoveredClientId, setHoveredClientId] = useState(null);
    const [selectedDateDetails, setSelectedDateDetails] = useState([]); // State to store selected date details

    useEffect(() => {
        dispatch(activeRent()).then(() => setLoading(false));
    }, [dispatch]);

    useEffect(() => {
        if (rentData?.length > 0) {
            setDueDates(
                rentData?.map((ele) => ({
                    date: format(new Date(ele.dueDate), "yyyy-MM-dd"),
                    clientId: ele.client.client,
                    clientName: ele.client?.name, // Add client name
                    book: ele.book?.modifiedTitle,
                    rentalStartDate: ele.rentalStartDate,
                    dueDate: ele.dueDate,
                    period: ele.period,
                }))
            );
        }
    }, [rentData]);

    // Handle date click
    const handleDateClick = (date) => {
        const formattedDate = format(new Date(date), "yyyy-MM-dd");
        const details = rentData.filter(
            (ele) => format(new Date(ele.dueDate), "yyyy-MM-dd") === formattedDate
        );
        setSelectedDateDetails(details); // Set the details for the selected date
    };

    return (
        <div className="flex flex-col items-center bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Due Date Calendar</h2>
            {loading ? (
                <p className="text-gray-500">Loading due dates...</p>
            ) : (
                <div className="relative">
                    <Calendar
                        className="border border-gray-300 rounded-lg p-4"
                        tileClassName={({ date }) => {
                            if (!date || isNaN(date.getTime())) return "";
                            const formattedDate = format(new Date(date), "yyyy-MM-dd");
                            return dueDates.some((ele) => ele.date === formattedDate)
                                ? "bg-red-200 rounded-full"
                                : "";
                        }}
                        tileContent={({ date }) => {
                            if (!date || isNaN(date.getTime())) return null;
                            const formattedDate = format(new Date(date), "yyyy-MM-dd");
                            const matchEntry = dueDates.find((ele) => ele.date === formattedDate);
                            return matchEntry ? (
                                <span
                                    className="text-red-600 cursor-pointer"
                                    onMouseEnter={() => {
                                        setHoveredClientId(matchEntry.clientId);
                                        setBook(matchEntry.book);
                                    }}
                                    onMouseLeave={() => setHoveredClientId(null)}
                                >
                                    <AiOutlineCheckSquare size={18}/>
                                </span>
                            ) : null;
                        }}
                        onClickDay={handleDateClick} // Add click handler for dates
                    />
                    {hoveredClientId && (
                        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm p-2 rounded shadow-md">
                            <p>Client ID: {hoveredClientId}</p>
                            <p>Book: {book}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Display selected date details */}
            {selectedDateDetails.length > 0 && (
                <div className="mt-6 w-full">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Rent Details for Selected Date
                    </h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Book
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Client Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rent Start Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Due Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration (Days)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {selectedDateDetails.map((ele, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ele.book?.modifiedTitle}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ele.client?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {format(new Date(ele.rentalStartDate), "yyyy-MM-dd")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {format(new Date(ele.dueDate), "yyyy-MM-dd")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ele.period}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}