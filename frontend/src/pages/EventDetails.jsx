import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaCalendarAlt, FaUserTie, FaUser, FaSignOutAlt, FaRegCalendarAlt, FaMapMarkerAlt, FaArrowLeft, FaTicketAlt  } from "react-icons/fa";
import {MdEventSeat } from 'react-icons/md';
import "../styles/EventPage.css";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import {Toaster, toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';
import { CloseButton, Spacer, Stack, Textarea } from "@chakra-ui/react";

const EventDetails = () => {
    const navigate = useNavigate();
    const {eventId} = useParams();

    const [eventData, setEventData] = useState();
    const [comment, setComment] = useState('');
    const [bookingDiv, setBookingDiv] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [totalTicketsBooked, setTotalTicketsBooked] = useState();
    const [transactionId, setTransactionId] = useState('');

    useEffect(()=>{
        const toastId = toast.loading('Fetching events data...');
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
    }, [refresh]);

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

    const addComment = (eventId) =>{
        if(comment === ''){
            toast.error('Enter a comment');
            return;
        }
        const token = sessionStorage.getItem('token');
        axios.post(getBaseURL() + '/comment/add', {eventId, commentDesc : comment}, {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message);
                setComment('');
                setRefresh(!refresh);
            }
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message);
        });
    }

    const bookTicket = (e) =>{
        e.preventDefault();
        if(!totalTicketsBooked || transactionId === ''){
            toast.error('Please enter all fields');
            return;
        }
        const token = sessionStorage.getItem('token');
        axios.post(getBaseURL() + '/booking/tickets', {bookingFor : eventData._id, transactionId, totalCost : (totalTicketsBooked * eventData.ticketFare), totalTicketsBooked}, {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message);
                setBookingDiv(false);
                setTransactionId('');
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

    if(!eventData){
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
                <Stack direction={'row'}>
                    <FaArrowLeft onClick={navigateToEvents} style={{fontSize: '26px', marginTop: '6px'}}/>
                    <h2 className="title" style={{marginLeft: '10px'}}> Event Details</h2>
                </Stack>
                <div style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                    <img src={eventData.eventPosterURL} style={{height: '220px', width: '360px'}}/>
                    <div style={{marginLeft: '20px'}}>
                        <h3 className="event-name" style={{fontSize: '24px'}}>{eventData.eventName}</h3>
                        <p className="event-info" style={{marginTop: '10px', fontSize: '18px'}}><FaRegCalendarAlt className="icon" style={{marginRight:'0'}}/>{eventData.eventDate} <FaMapMarkerAlt className="icon" style={{marginRight:'0'}}/>{eventData.eventLocation}</p>
                        <p className="event-info" style={{marginTop: '10px', fontSize: '18px'}}><FaUserTie className="icon" style={{marginRight:'0'}}/>Listed by {eventData.listedBy.name} on {eventData.listingDate}</p>
                        <p className="event-info" style={{marginTop: '10px', fontSize: '18px'}}><FaTicketAlt className="icon" style={{marginRight:'0'}}/>Rs. {eventData.ticketFare}</p>
                        <div style={{marginTop: '10px'}}>
                            <button onClick={()=>setBookingDiv(true)} className="view-btn">Book Ticket</button>
                            <button onClick={()=>addBookmark(eventData._id)} className="bookmark-btn" style={{marginLeft: '20px'}}>Bookmark</button>
                        </div>
                    </div>
                </div>
                <p style={{marginTop: '10px', fontSize: '16px', color: '#d7d7d7'}}>{eventData.eventDescription}</p>
                <hr/>
                <p style={{marginTop: '10px', fontSize: '18px', fontWeight: 'bold', color: '#d7d7d7'}}>Special Notes</p>
                <p style={{marginTop: '10px', fontSize: '16px', color: '#d7d7d7'}}>{eventData.specialNotes}</p>
                <hr/>
                <p style={{marginTop: '10px', fontSize: '18px', fontWeight: 'bold', color: '#d7d7d7'}}>Comments</p>
                
                <Textarea name='comment' value={comment} onChange={(e)=>setComment(e.target.value)} style={{height: '80px', width: '100%', backgroundColor: '#2c3044', border: '1px solid #333', placeholder: 'Add comment', marginTop: '10px'}}/>
                <button onClick={()=>addComment(eventData._id)} className="bookmark-btn" style={{marginTop: '10px'}}>Comment</button>

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
            </main>

            {bookingDiv && <div style={{height: '500px', width: 'min(90%, 600px)', position: 'absolute', top: '70px', left: 'calc((100% - 600px)/2)', zIndex: 10, backgroundColor: '#212738', borderRadius: '10px', boxShadow: '0 2px 5px black', border: '1px solid #d7d7d7', padding: '10px 10px 10px 15px', overflowY: 'scroll', scrollbarWidth: 'none'}}>
                <Stack direction={'row'}>
                    <h3 className="title">Book Ticket</h3>
                    <Spacer/>
                    <CloseButton onClick={()=>setBookingDiv(false)}/>
                </Stack>
                <h3 className="event-name" style={{fontSize: '22px'}}>{eventData.eventName}</h3>
                <p className="event-info" style={{marginTop: '10px', fontSize: '18px'}}><FaRegCalendarAlt className="icon" style={{marginRight:'0'}}/>{eventData.eventDate} <FaMapMarkerAlt className="icon" style={{marginRight:'0'}}/>{eventData.eventLocation}</p>
                <p className="event-info" style={{marginTop: '10px', fontSize: '18px'}}><FaTicketAlt className="icon" style={{marginRight:'0'}}/>Rs. {eventData.ticketFare}</p>
                <Stack direction="row" mt='15px'>
                    <div>
                        <label className="login-label">Total Tickets</label><br/>
                        <input type="number" name='totalTicketsBooked' value={totalTicketsBooked} onChange={(e)=>setTotalTicketsBooked(e.target.value)} required min={1} className="login-input" />
                    </div>
                    <div>
                        <label className="login-label">Total Fare</label><br/>
                        <input type="number" value={(totalTicketsBooked * eventData.ticketFare)} readOnly className="login-input" />
                    </div>
                    <div>
                        <label className="login-label">Transaction Id</label><br/>
                        <input type="text" name='transactionId' value={transactionId} onChange={(e)=>setTransactionId(e.target.value)} required className="login-input" />
                    </div>
                </Stack>
                <div style={{width: '100%', display: 'grid', placeItems: 'center',}}>
                    <p className="event-info" style={{marginTop: '10px', fontSize: '16px'}}>Make a payment of Rs.{totalTicketsBooked * eventData.ticketFare} on the following QR code</p>
                    <img src={eventData.paymentQrURL} style={{height: '180px', width: '180px'}}/>
                </div>
                <p className="event-info" style={{margin: '10px', fontSize: '16px'}}>Bookings made once cannot be cancelled. Check everything before proceeding.</p>
                <button onClick={bookTicket} className="view-btn">Confirm Booking</button>
            </div>}

            <Toaster position="top-right" toastOptions={{style: {background: '#212738', color: '#ffffff', borderRadius: '0px', padding: '12px 16px', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', fontSize: '16px'}}} />
        </div>
    );
};

export default EventDetails;
