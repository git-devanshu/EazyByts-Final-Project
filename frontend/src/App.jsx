import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import EventPage from './pages/EventPage';
import EventDetails from './pages/EventDetails';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ManageEvents from './pages/ManageEvents';

export default function App() {
    return (
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<SkipLogin />} />
                    <Route path='/signup' element={<SkipSignup />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path='/dashboard' element={<ProtectedDashboard />} />
                    <Route path='/events' element={<ProtectedEvents />} />
                    <Route path='/bookings' element={<ProtectedBookings />} />
                    <Route path='/profile' element={<ProtectedProfile />} />
                    <Route path='/events/details/:eventId' element={<ProtectedEventDetails />} />
                    <Route path='/events/manage/:eventId' element={<ProtectedManageEvents />} />
                    <Route path='/*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    )
}

const SkipLogin = () =>{
    const token = sessionStorage.getItem('token');
    if(token){
        return <Navigate to="/dashboard" />
    }
    else{
        return <Login />
    }
}

const SkipSignup = () =>{
    const token = sessionStorage.getItem('token');
    if(token){
        return <Navigate to="/dashboard" />
    }
    else{
        return <Signup />
    }
}

const ProtectedEvents = () =>{
    const token = sessionStorage.getItem('token');
    if(token){
        return <EventPage/>
    }
    else{
        return <Navigate to='/' />
    }
}

const ProtectedEventDetails = () =>{
    const token = sessionStorage.getItem('token');
    if(token){
        return <EventDetails/>
    }
    else{
        return <Navigate to='/' />
    }
}

const ProtectedBookings = () =>{
    const token = sessionStorage.getItem('token');
    if(token){
        return <Bookings/>
    }
    else{
        return <Navigate to='/' />
    }
}

const ProtectedProfile = () =>{
    const token = sessionStorage.getItem('token');
    if(token){
        return <Profile/>
    }
    else{
        return <Navigate to='/' />
    }
}

const ProtectedDashboard = () =>{
    const token = sessionStorage.getItem('token');
    if(token){
        return <Dashboard/>
    }
    else{
        return <Navigate to='/' />
    }
}

const ProtectedManageEvents = () =>{
    const token = sessionStorage.getItem('token');
    if(token){
        return <ManageEvents/>
    }
    else{
        return <Navigate to='/' />
    }
}