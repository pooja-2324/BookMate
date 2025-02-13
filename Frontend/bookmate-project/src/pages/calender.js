import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { activeRent } from "../slices/rentSlice";

export default function DueDateCalendar() {
    const dispatch = useDispatch();
    const { rentData } = useSelector((state) => state.rents);
    const [dueDates, setDueDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState(null);
    const [hoveredClientId, setHoveredClientId] = useState(null);

    useEffect(() => {
        dispatch(activeRent()).then(() => setLoading(false));
    }, [dispatch]);

    useEffect(() => {
        if (rentData?.length > 0) {
            setDueDates(
                rentData?.map((ele) => ({
                    date: format(new Date(ele.dueDate), "yyyy-MM-dd"),
                    clientId: ele.client,
                    book: ele.book?.modifiedTitle,
                }))
            );
        }
    }, [rentData]);

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
                                    🔴
                                </span>
                            ) : null;
                        }}
                    />
                    {hoveredClientId && (
                        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm p-2 rounded shadow-md">
                            <p>Client ID: {hoveredClientId}</p>
                            <p>Book: {book}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
