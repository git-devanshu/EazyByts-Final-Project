import React, { useEffect, useState } from "react";
import { MdDashboard, MdEventSeat} from "react-icons/md";
import { FaCalendarAlt, FaUser, FaSignOutAlt, FaRegCalendarAlt, FaMapMarkerAlt, FaTicketAlt  } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {Toaster, toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';
import MyCalendar from "../components/MyCalendar";
import Ticket from "../components/Ticket";

export default function Bookings() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [ticketDiv, setTicketDiv] = useState(false);
    const [ticketData, setTicketData] = useState({});

    useEffect(()=>{
        const toastId = toast.loading('Fetching your bookings...');
        const token = sessionStorage.getItem('token');
        axios.get(getBaseURL() + '/booking/data', {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res => {
            if(res.status === 200){
                setData(res.data);
                toast.success('Data fetched', {id : toastId});
            }
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message, {id: toastId});
        });
    }, []);

    const showTicket = (ind) =>{
        setTicketData(data[ind]);
        setTicketDiv(true);
    }

    const logout = () =>{
        sessionStorage.removeItem('token');
        toast.success('User logged out');
        setTimeout(()=>{
            navigate('/');
        }, 1000);
    }

    const navigateToDashboard = () =>{
        navigate('/dashboard');
    }

    const navigateToBookings = () =>{
        navigate('/bookings');
    }

    const navigateToProfile = () =>{
        navigate('/profile');
    }

    const navigateToEvents = () =>{
        navigate('/events');
    }

    return (
        <div className="event-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2 className="logo">EventGo</h2>
                <ul className="nav-links">
                    <li onClick={navigateToDashboard}><MdDashboard className="icon" /> Dashboard</li>
                    <li onClick={navigateToEvents}><FaCalendarAlt className="icon" /> Events</li>
                    <li onClick={navigateToBookings} className="active"><MdEventSeat  className="icon" /> Bookings</li>
                    <li onClick={navigateToProfile}><FaUser className="icon" /> Profile</li>
                </ul>
                <hr />
                <ul className="nav-links">
                    <li onClick={logout}><FaSignOutAlt className="icon" /> Logout</li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <h2 className="title">My Bookings</h2>
                <div style={{width: '100%', display: 'grid', gridTemplateColumns: 'auto 320px', gap: '15px'}}>
                    <div>
                        {/* <div className="filters">
                            <button className="filter-btn active">Upcoming</button>
                            <button className="filter-btn">Past</button>
                            <input type="text" className="search-box" placeholder="Search events" />
                        </div> */}
                        <div className="event-list">
                            {data?.length === 0 && <p className="event-info" style={{fontSize: '16px', color: 'white', textAlign: 'left'}}>You haven't booked any event yet</p>}
                            {data && data.length !== 0 && data.map((event, ind) => (
                                <div key={event.ind} className="event-card">
                                    <div className="event-details">
                                        <h3 className="event-name">{event.bookingFor.eventName}</h3>
                                        <p className="event-info"><FaRegCalendarAlt className="icon" style={{marginRight:'0'}}/>{event.bookingFor.eventDate} <FaTicketAlt className="icon" style={{marginRight:'0'}}/>Rs.{event.totalCost} <FaMapMarkerAlt className="icon" style={{marginRight:'0'}}/>{event.bookingFor.eventLocation}</p>
                                        <p className="event-info">{event.totalTicketsBooked} tickets booked on {event.bookingDate}</p>
                                    </div>
                                    <div className="event-actions">
                                        <button onClick={()=>showTicket(ind)} className="view-btn">View Pass</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <MyCalendar highlightedDates={data.length === 0 ? [] : data.map(item => item.bookingFor.eventDate)}/>
                </div>
            </main>

            <Toaster position="top-right" toastOptions={{style: {background: '#212738', color: '#ffffff', borderRadius: '0px', padding: '12px 16px', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', fontSize: '16px'}}} />

            {ticketDiv && <Ticket eventData={ticketData} onClose={()=>setTicketDiv(false)}/>}
        </div>
    )
}
