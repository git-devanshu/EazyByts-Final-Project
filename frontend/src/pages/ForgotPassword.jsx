import React, { useState } from "react";
import "../styles/Login.css";
import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {Toaster, toast} from 'react-hot-toast';
import {getBaseURL} from '../utils/helperFunctions';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [showDiv, setShowDiv] = useState(false);
    const [username, setUsername] = useState('');
    const [vfcode, setVfcode] = useState('');
    const [password, setPassword] = useState('');

    const verifyUser = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Verifying...');
        axios.post(getBaseURL() + '/auth/forgot-password', {username})
        .then(res => {
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setShowDiv(true);
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id :toastId});
        });
    }

    const resetPassword = (e) =>{
        e.preventDefault();
        const toastId = toast.loading('Setting new password...');
        axios.post(getBaseURL()+'/auth/reset-password', {vfcode, password, username})
        .then(res =>{
            if(res.status === 200){
                toast.success(res.data.message, {id :toastId});
                setTimeout(()=>{
                    navigate('/')
                }, 2000);
            }
            else{
                toast.error(res.data.message, {id :toastId});
            }
        })
        .catch(err =>{
            console.log(err);
            toast.error(err.response.data.message, {id :toastId});
        });
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="app-title">EventGo</h1>
                {showDiv && <h2 className="login-heading">Set New Password</h2>}
                {!showDiv && (
                    <div>
                        <h2 className="login-heading">Verify Email</h2>
                        <h2 style={{fontSize: '16px', fontWeight: 300, textAlign: 'center', marginTop: '0'}}>A verification code will be sent to your registered email id</h2>
                    </div>
                )}
                
                {!showDiv && (
                    <form className="login-form">
                        <label className="login-label">Username</label>
                        <input type="text" name='username' value={username} onChange={(e)=>setUsername(e.target.value)} required minLength={3} maxLength={20} className="login-input" />
                        <button onClick={verifyUser} className="login-button">
                            Send Verification Code
                        </button>
                        <p className="signup-text">
                            Try Login? <a href="/" className="signup-link">Login</a>
                        </p>
                    </form>
                )}
                {showDiv && (
                    <form className="login-form">
                        <label className="login-label">Verification Code</label>
                        <div style={{display: 'grid', placeItems: 'center', marginTop: '10px', marginBottom: '10px'}}>
                            <HStack>
                                <PinInput type="number" value={vfcode} onChange={(value) => setVfcode(value)}>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </div>
                        <label className="login-label">New Password</label>
                        <input type="password" name='password' value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={8} maxLength={30} className="login-input" />
                        <button onClick={resetPassword} className="login-button">
                            Confirm
                        </button>
                    </form>
                )}
            </div>
            <Toaster position="top-right" toastOptions={{style: {background: '#212738', color: '#ffffff', borderRadius: '0px', padding: '12px 16px', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', fontSize: '16px'}}} />
        </div>
    );
};

export default ForgotPassword;
