import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

const MyCalendar = ({ highlightedDates }) => {
    const [value, setValue] = useState(new Date());
    const today = moment().format("DD-MM-YYYY");

    const tileClassName = ({ date, view }) => {
        const formattedDate = moment(date).format("DD-MM-YYYY");
        if (formattedDate === today) {
            return "today-highlight";
        } 
        else if (highlightedDates.includes(formattedDate)) {
            return "special-highlight";
        }
    };

    return (
        <div>
            <Calendar 
                onChange={setValue} 
                value={value} 
                tileClassName={tileClassName} 
            />
            <style>
                {`
                .react-calendar {
                    background: #212738;
                    color: #f8f8f2; /* Light text */
                    border: none;
                    border-radius: 8px;
                    padding: 10px;
                }

                .react-calendar__tile {
                    border-radius: 6px;
                    transition: 0.2s ease-in-out;
                }

                .react-calendar__tile:hover {
                    background: #44475a !important; /* Hover effect */
                    color: white !important;
                }

                .today-highlight {
                    background: #ff5555 !important; /* Today's date - red */
                    color: white !important;
                    border-radius: 50%;
                    font-weight: bold;
                }

                .special-highlight {
                    background: #3CB5FB !important; /* Highlighted dates - cyan */
                    color: #282a36 !important;
                    border-radius: 50%;
                    font-weight: bold;
                }

                .react-calendar__tile--active {
                    background: #d7d7d7 !important; /* Selected date - purple */
                    color: #212738 !important;
                }

                .react-calendar__navigation {
                    background: #212738;
                    color: #f8f8f2;
                    border-radius: 8px;
                }

                .react-calendar__navigation button {
                    color: #f8f8f2;
                    font-size: 16px;
                }

                .react-calendar__navigation button:hover {
                    background: transparent !important;
                    color: #f8f8f2 !important;
                    cursor: default !important;
                }

                .react-calendar__month-view__weekdays {
                    color: #d7d7d7; /* Orange for weekday names */
                    text-decoration: none;
                }
                `}
            </style>
        </div>
    );
};

export default MyCalendar;
