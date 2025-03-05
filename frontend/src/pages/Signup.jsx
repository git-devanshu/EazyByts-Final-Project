import React, { useState } from "react";
import "../styles/Login.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {Toaster, toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';

const Signup = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email : '',
        name : '',
        username : '',
        password : ''
    });

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setUser({
            ...user,
            [name] : value
        });
    }

    const registerUser = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Signing Up...');
        axios.post(getBaseURL() + '/auth/signup', user)
        .then(res =>{
            if(res.status === 201){
                toast.success(res.data.message, {id : toastId});
                setTimeout(()=>{
                    navigate('/');
                }, 1500);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id : toastId});
        });
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="app-title">EventGo</h1>
                <h2 className="login-heading">Signup</h2>
                <form className="login-form">
                    <label className="login-label">Email</label>
                    <input type="email" name='email' value={user.email} onChange={handleChange} required className="login-input" />
                    
                    <label className="login-label">Name</label>
                    <input type="text" name='name' value={user.name} onChange={handleChange} required className="login-input" />
                    
                    <label className="login-label">Username</label>
                    <input type="text" name='username' value={user.username} onChange={handleChange} required minLength={3} maxLength={20} className="login-input" />
                    
                    <label className="login-label">Password</label>
                    <input type="password" name='password' value={user.password} onChange={handleChange} required minLength={8} maxLength={30} className="login-input" />
                    
                    <button onClick={registerUser} className="login-button">
                        Signup
                    </button>
                </form>
                <p className="signup-text">
                    Already registered? <a href="/" className="signup-link">Login</a>
                </p>
            </div>
            <Toaster position="top-right" toastOptions={{style: {background: '#212738', color: '#ffffff', borderRadius: '0px', padding: '12px 16px', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', fontSize: '16px'}}} />
        </div>
    );
};

export default Signup;
