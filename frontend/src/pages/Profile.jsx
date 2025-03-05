import React, { useEffect, useState } from "react";
import { MdDashboard, MdEventSeat } from "react-icons/md";
import { FaCalendarAlt, FaUserTie, FaUserCircle, FaUser, FaSignOutAlt, FaRegCalendarAlt, FaMapMarkerAlt, FaArrowLeft, FaTicketAlt  } from "react-icons/fa";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import {Toaster, toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';
import { CloseButton, Spacer, Stack, Textarea } from "@chakra-ui/react";

export default function Profile() {
    const navigate = useNavigate();

    const [data, setData] = useState();
    const [refresh, setRefresh] = useState(false);
    const [showDiv, setShowDiv] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(()=>{
        const toastId = toast.loading('Fetching profile data...');
        const token = sessionStorage.getItem('token');
        axios.get(getBaseURL() + '/user/data', {headers : {
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

    const removeBookmark = (eventId) =>{
        const token = sessionStorage.getItem('token');
        axios.put(getBaseURL() + '/event/remove-bookmark', {eventId}, {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message);
                setRefresh(!refresh);
            }
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message);
        });
    }

    const updateProfile = (e) =>{
        e.preventDefault();
        if(name === '' || email === ''){
            toast.error('All fields are required');
            return;
        }
        const token = sessionStorage.getItem('token');
        axios.put(getBaseURL() + '/user/update', {name, email}, {headers : {
            'Authorization' : `Bearer ${token}`
        }})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message);
                setRefresh(!refresh);
                setShowDiv(false);
            }
        })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message);
        });
    }

    const setDataToUpdate = () =>{
        setShowDiv(true);
        setName(data.name);
        setEmail(data.email);
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

    if(!data){
        return <div style={{height: '100vh', width: '100%', backgroundColor : '#181C29', display: 'grid', placeItems: 'center'}}>
            <h1 style={{fontSize: '24px', color: '#d7d7d7'}}>Loading Profile Details...</h1>
        </div>
    }

    return (
        <div className="event-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2 className="logo">EventGo</h2>
                <ul className="nav-links">
                    <li onClick={navigateToDashboard}><MdDashboard className="icon" /> Dashboard</li>
                    <li onClick={navigateToEvents}><FaCalendarAlt className="icon" /> Events</li>
                    <li onClick={navigateToBookings}><MdEventSeat  className="icon" /> Bookings</li>
                    <li onClick={navigateToProfile} className="active"><FaUser className="icon" /> Profile</li>
                </ul>
                <hr />
                <ul className="nav-links">
                    <li onClick={logout}><FaSignOutAlt className="icon" /> Logout</li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <h2 className="title">Profile</h2>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', gap: '15px'}}>
                    {/* profile and bookmarks div */}
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        {/* profile details */}
                        <FaUserCircle style={{fontSize: '100px'}}/>
                        <p style={{fontSize: '20px', fontWeight: 'bold', color: '#d7d7d7', marginTop: '10px'}}>Hello {data.username}</p>
                        <hr style={{ width: "100%", marginTop: "20px", border: "0.5px solid #ccc" }} />
                        <div style={{fontSize: '18px', fontWeight: '400', color: '#d7d7d7', display: 'flex', width: '100%'}}>Name<Spacer/>{data.name}</div>
                        <div style={{fontSize: '18px', fontWeight: '400', color: '#d7d7d7', marginTop: '10px', display: 'flex', width: '100%'}}>Email<Spacer/>{data.email}</div>
                        <div style={{fontSize: '18px', fontWeight: '400', color: '#d7d7d7', marginTop: '10px', display: 'flex', width: '100%'}}>Registered On<Spacer/>{data.registeredOn}</div>
                        <hr style={{ width: "100%", margin: "10px auto", border: "0.5px solid #ccc" }} />
                        <button onClick={setDataToUpdate} className="bookmark-btn">Update Profile</button>

                        {/* bookmarks */}
                        <div style={{backgroundColor: '#212738', width:'100%', borderRadius: '15px', padding: '15px', marginTop: '40px'}}>
                            <p style={{fontSize: '18px', fontWeight: 'bold', color: '#d7d7d7', textAlign: 'left', marginBottom: '15px'}}>Bookmarks</p>
                            {data?.bookmarks.length === 0 && <p className="event-info" style={{fontSize: '16px', color: 'white', textAlign: 'left'}}>No Bookmarks added</p>}
                            {data?.bookmarks.length !== 0 && data.bookmarks.map((event, ind) => (
                                <div key={ind} className="event-card" style={{padding: "0", marginTop: '15px'}}>
                                    <img className="event-image" src={event.eventPosterURL}/>
                                    <div className="event-details">
                                        <h3 className="event-name">{event.eventName}</h3>
                                        <p className="event-info"><FaRegCalendarAlt className="icon" style={{marginRight:'0'}}/>{event.eventDate} <FaMapMarkerAlt className="icon" style={{marginRight:'0'}}/>{event.eventLocation}</p>
                                    </div>
                                    <div className="event-actions">
                                        <button onClick={()=>removeBookmark(event._id)} className="bookmark-btn">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* notification div */}
                    <div style={{width: '100%', height: 'auto', borderRadius: '12px'}}>
                        <p style={{fontSize: '18px', fontWeight: 'bold', color: '#d7d7d7'}}>Notifications</p>
                        {data?.notifications.length === 0 && <p className="event-info" style={{fontSize: '16px', color: 'white'}}>You're all caught up!</p>}
                        {data && data.notifications.length !== 0 && [...data.notifications].reverse().map((notification, ind)=>{
                            return(
                                <div key={ind} className="event-card" style={{marginTop: '10px'}}>
                                    <div className="event-details">
                                        <div className="event-info" style={{display: 'flex'}}>{notification.notificationDate}<Spacer/>{notification.notificationTime}</div>
                                        <p className="event-info" style={{fontSize: '16px', color: 'white'}}>{notification.message}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* upadte profile popup */}
            {showDiv && <div style={{height: 'auto', width: '400px', position: 'absolute', top: '120px', left: 'calc((100% - 400px)/2)', zIndex: 10, backgroundColor: '#212738', borderRadius: '10px', boxShadow: '0 2px 5px black', border: '1px solid #d7d7d7', padding: '10px'}}>
                <Stack direction={'row'}>
                    <h3 className="title" style={{fontSize: '20px', fontFamily :'400'}}>Update Profile</h3>
                    <Spacer/>
                    <CloseButton onClick={()=>setShowDiv(false)}/>
                </Stack>
                <Stack direction="row" mt='5px'>
                    <div>
                        <label className="login-label">Name</label><br/>
                        <input type="text" name='name' value={name} onChange={(e)=>setName(e.target.value)} required className="login-input" />
                    </div>
                    <Spacer/>
                    <div>
                        <label className="login-label">Email</label><br/>
                        <input type="text" name='email' value={email} onChange={(e)=>setEmail(e.target.value)} required className="login-input" />
                    </div>
                </Stack>
                <button onClick={updateProfile} className="view-btn">Update</button>
            </div>}

            <Toaster position="top-right" toastOptions={{style: {background: '#212738', color: '#ffffff', borderRadius: '0px', padding: '12px 16px', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', fontSize: '16px'}}} />
        </div>
    )
}
