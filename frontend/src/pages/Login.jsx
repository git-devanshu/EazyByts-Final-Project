import React, { useState } from "react";
import "../styles/Login.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {Toaster, toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';

const Login = () => {
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

    const loginUser = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Logging in...');
        axios.post(getBaseURL() + '/auth/login', user)
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id : toastId});
                sessionStorage.setItem('token', res.data.token);
                setTimeout(()=>{
                    navigate('/dashboard');
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
                <h2 className="login-heading">Welcome Back</h2>
                <form className="login-form">
                    <label className="login-label">Username</label>
                    <input type="text" name='username' value={user.username} onChange={handleChange} required minLength={3} maxLength={20} className="login-input" />
                    
                    <label className="login-label">Password</label>
                    <input type="password" name='password' value={user.password} onChange={handleChange} required minLength={8} maxLength={30} className="login-input" />
                    
                    <a href="/forgot-password" className="forgot-password">
                        Forgot Password?
                    </a>

                    <button onClick={loginUser} className="login-button">
                        Login
                    </button>
                </form>
                <p className="signup-text">
                    New User? <a href="/signup" className="signup-link">Signup</a>
                </p>
            </div>
            <Toaster position="top-right" toastOptions={{style: {background: '#212738', color: '#ffffff', borderRadius: '0px', padding: '12px 16px', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', fontSize: '16px'}}} />
        </div>
    );
};

export default Login;
