import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaCalendarAlt, FaUser, FaSignOutAlt, FaRegCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import {MdEventSeat } from 'react-icons/md';
import "../styles/EventPage.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {Toaster, toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';

const EventPage = () => {
    const navigate = useNavigate();
    const [showDiv, setShowDiv] = useState(false);
    const [data, setData] = useState([]);

    useEffect(()=>{
        const toastId = toast.loading('Fetching events data...');
        const token = sessionStorage.getItem('token');
        axios.get(getBaseURL() + '/event/data', {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res => {
            if(res.status === 200){
                setData(res.data);
                console.log(res.data);
                toast.success('Data fetched', {id : toastId});
            }
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message, {id: toastId});
        });
    }, []);

    const addBookmark = (eventId) =>{
        const token = sessionStorage.getItem('token');
        axios.put(getBaseURL() + '/event/bookmark', {eventId}, {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message);
            }
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message);
        });
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

    const navigateToEventDetails = (eventId) =>{
        navigate(`/events/details/${eventId}`);
    }
    
    return (
        <div className="event-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2 className="logo">EventGo</h2>
                <ul className="nav-links">
                    <li onClick={navigateToDashboard}><MdDashboard className="icon" /> Dashboard</li>
                    <li onClick={navigateToEvents} className="active" ><FaCalendarAlt className="icon" /> Events</li>
                    <li onClick={navigateToBookings}><MdEventSeat  className="icon" /> Bookings</li>
                    <li onClick={navigateToProfile}><FaUser className="icon" /> Profile</li>
                </ul>
                <hr />
                <ul className="nav-links">
                    <li onClick={logout}><FaSignOutAlt className="icon" /> Logout</li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <h2 className="title">Events</h2>
                {/* <div className="filters">
                    <button className="filter-btn active">Upcoming</button>
                    <button className="filter-btn">Past</button>
                    <input type="text" className="search-box" placeholder="Search events" />
                </div> */}

                {/* Event List */}
                <div className="event-list">
                    {data?.length === 0 && <p className="event-info" style={{fontSize: '16px', color: 'white', textAlign: 'left'}}>No Events present</p>}
                    {data && data.length !== 0 && data.map((event, ind) => (
                        <div key={ind} className="event-card">
                            <img className="event-image" src={event.eventPosterURL}/>
                            <div className="event-details">
                                <h3 className="event-name">{event.eventName}</h3>
                                <p className="event-info"><FaRegCalendarAlt className="icon" style={{marginRight:'0'}}/>{event.eventDate} <FaMapMarkerAlt className="icon" style={{marginRight:'0'}}/>{event.eventLocation}</p>
                            </div>
                            <div className="event-actions">
                                <button onClick={()=>navigateToEventDetails(event._id)} className="view-btn">View More</button>
                                <button onClick={()=>addBookmark(event._id)} className="bookmark-btn">Bookmark</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            
            <Toaster position="top-right" toastOptions={{style: {background: '#212738', color: '#ffffff', borderRadius: '0px', padding: '12px 16px', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', fontSize: '16px'}}} />
        </div>
    );
};

export default EventPage;
