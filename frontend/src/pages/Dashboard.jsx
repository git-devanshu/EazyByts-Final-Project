import React, { useEffect, useState } from "react";
import { MdDashboard, MdEventSeat } from "react-icons/md";
import { FaCalendarAlt, FaUser, FaSignOutAlt, FaRegCalendarAlt, FaMapMarkerAlt, FaArrowLeft, FaTicketAlt, FaMoneyBill, FaMoneyBillWave } from "react-icons/fa";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import {Toaster, toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';
import { CloseButton, Heading, Spacer, Stack, Textarea, Text } from "@chakra-ui/react";
import { MdEventNote, MdCurrencyRupee } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import PerformanceGraph from "../components/PerformanceGraph";
import ImageUpload from "../components/ImageUpload";

export default function Dashboard() {
    const navigate = useNavigate();

    const [data, setData] = useState();
    const [refresh, setRefresh] = useState(false);
    const [showDiv, setShowDiv] = useState(false);
    const [event, setEvent] = useState({
        eventName : '',
        eventDate : '',
        eventLocation : '',
        ticketFare : 0,
        eventPosterURL : '',
        eventDescription : '',
        specialNotes : '',
        paymentQrURL : ''
    });

    useEffect(()=>{
        const toastId = toast.loading('Fetching Your Events...');
        const token = sessionStorage.getItem('token');
        axios.get(getBaseURL() + '/event/my-data', {headers : {
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
    }, [refresh]);

    const addEvent = () =>{
        const toastId = toast.loading('Adding event...');
        const token = sessionStorage.getItem('token');
        axios.post(getBaseURL() + '/event/add', event, {headers : {
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

    const navigateToManageEvents = (eventId) =>{
        navigate(`/events/manage/${eventId}`);
    }

    if(!data){
        return <div style={{height: '100vh', width: '100%', backgroundColor : '#181C29', display: 'grid', placeItems: 'center'}}>
            <h1 style={{fontSize: '24px', color: '#d7d7d7'}}>Loading Data...</h1>
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
                <h2 className="title">Dashboard</h2>
                <div style={{display :'grid', gridTemplateColumns: '2fr 3fr', gap: '15px'}}>
                    {/* stat div */}
                    <div>
                        <div style={{display: 'grid', width: '100%', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                            {/* total events added */}
                            <div style={{height: '100px', width: '100%', borderRadius: '10px', backgroundColor: '#212738', border: '1px solid #d7d7d7', display: 'flex', alignItems: 'center', padding: '10px'}}>
                                <MdEventNote style={{fontSize: '40px'}}/>
                                <Stack style={{marginLeft: '10px'}} spacing={0}>
                                    <Heading color='#3CB5FB' size='lg'>{data.length}</Heading>
                                    <Text color='#d7d7d7' fontSize={'14px'}> Total Events Added</Text>
                                </Stack>
                            </div>
                            {/* total bookings */}
                            <div style={{height: '100px', width: '100%', borderRadius: '10px', backgroundColor: '#212738', border: '1px solid #d7d7d7', display: 'flex', alignItems: 'center', padding: '10px'}}>
                                <FaTicketAlt style={{fontSize: '40px'}}/>
                                <Stack style={{marginLeft: '10px'}} spacing={0}>
                                    <Heading color='#3CB5FB' size='lg'>{data.reduce((sum, event)=> sum + event.bookings.length, 0)}</Heading>
                                    <Text color='#d7d7d7' fontSize={'14px'}> Total Bookings</Text>
                                </Stack>
                            </div>
                            {/* total revenue */}
                            <div style={{height: '100px', width: '100%', borderRadius: '10px', backgroundColor: '#212738', border: '1px solid #d7d7d7', display: 'flex', alignItems: 'center', padding: '10px'}}>
                                <MdCurrencyRupee style={{fontSize: '40px'}}/>
                                <Stack style={{marginLeft: '10px'}} spacing={0}>
                                    <Heading color='#3CB5FB' size='lg'>
                                        {data.reduce((sum, obj) => {return sum + obj.bookings.reduce((bookingSum, booking) => bookingSum + booking.totalCost, 0)}, 0)}
                                    </Heading>
                                    <Text color='#d7d7d7' fontSize={'14px'}> Total Revenue</Text>
                                </Stack>
                            </div>
                            {/* add new event */}
                            <div onClick={()=>setShowDiv(true)} style={{height: '100px', width: '100%', borderRadius: '10px', backgroundColor: '#181C29', border: '1px solid #d7d7d7', display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer'}}>
                                <AiOutlinePlusCircle style={{fontSize: '40px'}}/>
                                <Stack style={{marginLeft: '10px'}} spacing={0}>
                                    <Heading color='#ffffff' size='lg'>NEW</Heading>
                                    <Text color='#d7d7d7' fontSize={'14px'}> Add New Event</Text>
                                </Stack>
                            </div>
                        </div>
                        <div style={{width: '100%'}}>
                            <PerformanceGraph data={data}/>
                        </div>
                    </div>

                    {/* event div */}
                    <div style={{width:'100%'}}>
                        <p style={{fontSize: '18px', fontWeight: 'bold', color: '#d7d7d7', textAlign: 'left', marginBottom: '15px'}}>My Events</p>
                        {data?.length === 0 && <p className="event-info" style={{fontSize: '16px', color: 'white', textAlign: 'left'}}>No Bookmarks added</p>}
                        {data?.length !== 0 && data.map((event, ind) => (
                            <div key={ind} className="event-card" style={{marginBottom:'15px'}}>
                                <img className="event-image" src={event.eventPosterURL}/>
                                <div className="event-details">
                                    <h3 className="event-name">{event.eventName}</h3>
                                    <p className="event-info"><FaRegCalendarAlt className="icon" style={{marginRight:'0'}}/>{event.eventDate} <FaMapMarkerAlt className="icon" style={{marginRight:'0'}}/>{event.eventLocation}</p>
                                </div>
                                <div className="event-actions">
                                    <button onClick={()=>navigateToManageEvents(event._id)} className="view-btn">Manage</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* popup to add new event */}
            {showDiv && <div style={{height: '540px', width: '400px', position: 'absolute', top: '50px', left: 'calc((100% - 400px)/2)', zIndex: 10, backgroundColor: '#212738', borderRadius: '10px', boxShadow: '0 2px 5px black', border: '1px solid #d7d7d7', padding: '10px 10px 10px 15px', overflowY: 'scroll', scrollbarWidth: 'none'}}>
                <Stack direction={'row'}>
                    <h3 className="title">Add New Event</h3>
                    <Spacer/>
                    <CloseButton onClick={()=>setShowDiv(false)}/>
                </Stack>
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
                <Stack direction="row">
                    <div>
                        <label className="login-label">Ticket Fare</label><br/>
                        <input type="number" name='ticketFare' value={event.ticketFare} onChange={handleChange} required className="login-input" />
                    </div>
                    <div>
                        <label className="login-label">Event Date</label><br/>
                        <input type="date" name='eventDate' value={event.eventDate} onChange={handleChange} required className="login-input" />
                    </div>
                </Stack>
                
                <label className="login-label">Description</label><br/>
                <Textarea name='eventDescription' value={event.eventDescription} onChange={handleChange} style={{height: '120px', width: '100%', backgroundColor: '#2c3044', border: '1px solid #333', placeholder: 'Add description'}}/>

                <label className="login-label" style={{marginTop: '15px'}}>Special Notes</label><br/>
                <Textarea name='specialNotes' value={event.specialNotes} onChange={handleChange} style={{height: '50px', width: '100%', backgroundColor: '#2c3044', border: '1px solid #333', placeholder: 'Add special notes'}}/>

                <label className="login-label" style={{marginTop: '15px'}}>Event Poster (keep height to width ratio 9:15)</label><br/>
                <ImageUpload onUpload={(url)=>setEvent({...event, eventPosterURL : url})} h={220} w={370}/>
                <label className="login-label" style={{marginTop: '15px'}}>Payment QR Code (keep height to width ratio 1:1)</label><br/>
                <ImageUpload onUpload={(url)=>setEvent({...event, paymentQrURL : url})} h={200} w={200}/>
                
                <button onClick={addEvent} className="view-btn" style={{marginTop: '15px'}}>Add</button>
            </div>}

            <Toaster position="top-right" toastOptions={{style: {background: '#212738', color: '#ffffff', borderRadius: '0px', padding: '12px 16px', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', fontSize: '16px'}}} />
        </div>
    )
}
