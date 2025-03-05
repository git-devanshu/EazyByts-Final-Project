import React, { useEffect, useState } from "react";
import { MdCurrencyRupee, MdDashboard } from "react-icons/md";
import { FaCalendarAlt, FaUserTie, FaUser, FaSignOutAlt, FaRegCalendarAlt, FaMapMarkerAlt, FaArrowLeft, FaTicketAlt, FaRupeeSign  } from "react-icons/fa";
import {MdEventSeat } from 'react-icons/md';
import "../styles/EventPage.css";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import {Toaster, toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';
import { CloseButton, Spacer, Stack, Textarea } from "@chakra-ui/react";
import ImageUpload from "../components/ImageUpload";

const ManageEvents = () => {
    const navigate = useNavigate();
    const {eventId} = useParams();

    const [eventData, setEventData] = useState(); // data fetched from the server
    const [bookings, setBookings] = useState(); // data fetched from the server 
    const [showDiv, setShowDiv] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [event, setEvent] = useState({
        eventId : '',
        eventName : '', 
        eventLocation : '', 
        ticketFare : 0, 
        eventPosterURL : '', 
        eventDescription : '', 
        specialNotes : '', 
        paymentQrURL : ''
    }); // event object to update the data

    useEffect(()=>{
        fetchEventDetails();
        fetchEventBookings();
    }, [refresh]);

    const fetchEventDetails = () =>{
        const toastId = toast.loading('Fetching event data...');
        const token = sessionStorage.getItem('token');
        axios.get(getBaseURL() + `/event/data/${eventId}`, {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res => {
            if(res.status === 200){
                setEventData(res.data);
                toast.success('Data fetched', {id : toastId});
            }
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message, {id: toastId});
        });
    }

    const fetchEventBookings = () =>{
        const toastId = toast.loading('Fetching bookings data...');
        const token = sessionStorage.getItem('token');
        axios.get(getBaseURL() + `/booking/data/${eventId}`, {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res => {
            if(res.status === 200){
                setBookings(res.data);
                console.log(res.data);
                toast.success('Data fetched', {id : toastId});
            }
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message, {id: toastId});
        });
    }

    const updateEvent = () =>{
        const toastId = toast.loading('Updating event...');
        const token = sessionStorage.getItem('token');
        axios.put(getBaseURL() + '/event/update', event, {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                setRefresh(!refresh);
                setShowDiv(false);
            }
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message, {id: toastId});
        });
    }

    const removeEvent = () =>{
        const toastId = toast.loading('Deleting event...');
        const token = sessionStorage.getItem('token');
        axios.delete(getBaseURL() + `/event/remove/${eventId}`, {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                navigateToDashboard();
            }
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message, {id: toastId});
        });
    }

    const putDataToUpdate = () =>{
        setEvent({
            eventId,
            eventName : eventData.eventName, 
            eventLocation : eventData.eventLocation, 
            ticketFare : eventData.ticketFare, 
            eventPosterURL : eventData.eventPosterURL, 
            eventDescription : eventData.eventDescription, 
            specialNotes : eventData.specialNotes, 
            paymentQrURL : eventData.paymentQrURL
        });
        setShowDiv(true);
    }    

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setEvent({
            ...event,
            [name] : value
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

    if(!eventData || !bookings){
        return <div style={{height: '100vh', width: '100%', backgroundColor : '#181C29', display: 'grid', placeItems: 'center'}}>
            <h1 style={{fontSize: '24px', color: '#d7d7d7'}}>Loading Event Details...</h1>
        </div>
    }
    
    return (
        <div className="event-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2 className="logo">EventGo</h2>
                <ul className="nav-links">
                    <li onClick={navigateToDashboard} className="active"><MdDashboard className="icon" /> Dashboard</li>
                    <li onClick={navigateToEvents}><FaCalendarAlt className="icon" /> Events</li>
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
                <Stack direction={'row'}>
                    <FaArrowLeft onClick={navigateToDashboard} style={{fontSize: '26px', marginTop: '6px'}}/>
                    <h2 className="title" style={{marginLeft: '10px'}}> Event Details</h2>
                </Stack>

                <div style={{width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                    {/* event details */}
                    <div>
                        <img src={eventData.eventPosterURL} style={{height: '220px', width: '360px'}}/>
                        <div style={{marginLeft: '20px'}}>
                            <h3 className="event-name" style={{fontSize: '24px'}}>{eventData.eventName}</h3>
                            <p className="event-info" style={{marginTop: '10px', fontSize: '18px'}}><FaRegCalendarAlt className="icon" style={{marginRight:'0'}}/>{eventData.eventDate} <FaMapMarkerAlt className="icon" style={{marginRight:'0'}}/>{eventData.eventLocation}</p>
                            <p className="event-info" style={{marginTop: '10px', fontSize: '18px'}}><FaUserTie className="icon" style={{marginRight:'0'}}/>Listed by {eventData.listedBy.name} on {eventData.listingDate}</p>
                            <p className="event-info" style={{marginTop: '10px', fontSize: '18px'}}><FaTicketAlt className="icon" style={{marginRight:'0'}}/>Rs. {eventData.ticketFare}</p>
                            <div style={{marginTop: '10px'}}>
                                <button onClick={putDataToUpdate} className="view-btn">Update</button>
                                <button onClick={removeEvent} className="bookmark-btn" style={{marginLeft: '20px'}}>Remove</button>
                            </div>
                        </div>
                        <p style={{marginTop: '10px', fontSize: '16px', color: '#d7d7d7'}}>{eventData.eventDescription}</p>
                        <hr/>
                        <p style={{marginTop: '10px', fontSize: '18px', fontWeight: 'bold', color: '#d7d7d7'}}>Special Notes</p>
                        <p style={{marginTop: '10px', fontSize: '16px', color: '#d7d7d7'}}>{eventData.specialNotes}</p>
                        <hr/>

                        {/* comments */}
                        <p style={{marginTop: '10px', fontSize: '18px', fontWeight: 'bold', color: '#d7d7d7'}}>Comments</p>
                        {eventData?.comments?.length === 0 && <p style={{marginTop: '10px', fontSize: '16px', color: '#d7d7d7'}}>No comments added</p>}
                        {eventData.comments && eventData.comments.length !== 0 && eventData.comments.map((comment, index) => (
                            <div key={index} style={{ display: "flex", gap: "10px", padding: '20px 20px 0 20px' }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={{width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "gray", border: "2px solid #d7d7d7", marginTop:'5px'}}></div>
                                    {index !== eventData.comments.length && (
                                        <div style={{width: "2px", height: "100%", backgroundColor: "gray", flexGrow: 1}}></div>
                                    )}
                                </div>
                                <div>
                                    <strong style={{ color: "#d7d7d7" }}>{comment.commentedBy.username}</strong>
                                    <p style={{ color: "#d7d7d7", margin: "5px 0" }}>{comment.commentDesc}</p>
                                    <small style={{ color: "#d7d7d7" }}>{comment.commentDate}</small>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* bookings */}
                    <div>
                        <p style={{marginBottom: '10px', fontSize: '18px', fontWeight: 'bold', color: '#d7d7d7'}}>Bookings for this Event</p>
                        {bookings?.length === 0 && <p className="event-info" style={{fontSize: '16px', color: 'white', textAlign: 'left'}}>No Tickets have been booked for this event</p>}
                        {bookings?.map((booking, ind) => (
                            <div key={ind} className="event-card" style={{marginBottom:'15px'}}>
                                <div className="event-details">
                                    <p className="event-info" style={{marginBottom: '10px', fontSize: '18px'}}><FaUserTie className="icon" style={{marginRight:'0'}}/>{booking.bookingBy.name} <b>{booking.bookingBy.username}</b></p>
                                    <p className="event-info"><FaRegCalendarAlt className="icon" style={{marginRight:'0'}}/>{booking.bookingDate} <FaTicketAlt className="icon" style={{marginRight:'0'}}/>{booking.totalTicketsBooked} <MdCurrencyRupee className="icon" style={{marginRight:'0'}}/>{booking.totalCost}</p>
                                    <p className="event-info" style={{marginTop: '10px', fontSize: '16px'}}>Transaction Id : {booking.transactionId}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {showDiv && <div style={{height: '540px', width: '400px', position: 'absolute', top: '50px', left: 'calc((100% - 400px)/2)', zIndex: 10, backgroundColor: '#212738', borderRadius: '10px', boxShadow: '0 2px 5px black', border: '1px solid #d7d7d7', padding: '10px 10px 10px 15px', overflowY: 'scroll', scrollbarWidth: 'none'}}>
                <Stack direction={'row'}>
                    <h3 className="title">Update Event Data</h3>
                    <Spacer/>
                    <CloseButton onClick={()=>setShowDiv(false)}/>
                </Stack>
                <p className="event-info" style={{marginBottom: '10px', fontSize: '18px'}}>Event Id : {event.eventId}</p>
                <Stack direction="row">
                    <div>
                        <label className="login-label">Event Name</label><br/>
                        <input type="text" name='eventName' value={event.eventName} onChange={handleChange} required className="login-input" />
                    </div>
                    <div>
                        <label className="login-label">Event Location</label><br/>
                        <input type="text" name='eventLocation' value={event.eventLocation} onChange={handleChange} required className="login-input" />
                    </div>
                </Stack>
                <div>
                    <label className="login-label">Ticket Fare</label><br/>
                    <input type="number" name='ticketFare' value={event.ticketFare} onChange={handleChange} required className="login-input" />
                </div>

                <label className="login-label">Description</label><br/>
                <Textarea name='eventDescription' value={event.eventDescription} onChange={handleChange} style={{height: '120px', width: '100%', backgroundColor: '#2c3044', border: '1px solid #333', placeholder: 'Add description'}}/>

                <label className="login-label" style={{marginTop: '15px'}}>Special Notes</label><br/>
                <Textarea name='specialNotes' value={event.specialNotes} onChange={handleChange} style={{height: '50px', width: '100%', backgroundColor: '#2c3044', border: '1px solid #333', placeholder: 'Add special notes'}}/>

                <label className="login-label" style={{marginTop: '15px'}}>Event Poster (keep height to width ratio 9:15)</label><br/>
                <ImageUpload onUpload={(url)=>setEvent({...event, eventPosterURL : url})} h={220} w={370}/>
                <label className="login-label" style={{marginTop: '15px'}}>Payment QR Code (keep height to width ratio 1:1)</label><br/>
                <ImageUpload onUpload={(url)=>setEvent({...event, paymentQrURL : url})} h={200} w={200}/>
                
                <button onClick={updateEvent} className="view-btn" style={{marginTop: '15px'}}>Update</button>
            </div>}

            <Toaster position="top-right" toastOptions={{style: {background: '#212738', color: '#ffffff', borderRadius: '0px', padding: '12px 16px', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', fontSize: '16px'}}} />
        </div>
    );
};

export default ManageEvents;
