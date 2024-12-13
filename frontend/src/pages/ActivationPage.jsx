import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { server } from '../server';
import axios from 'axios';

const ActivationPage = () => {
    const { activation_token } = useParams();
    const [error, setError] = useState(false);

    useEffect(() => {
        if (activation_token) {
            const activationEmail = async () => {
                try {
                    const res = await axios.post(`${server}/user/activation`, { activation_token });
                    console.log(res.data.message);
                } catch (error) {
                    setError(true);
                    console.log(error.response.data.message);
                }
            }
            activationEmail();
        }
    }, [activation_token]);
    return (
        <div style={
            {
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }
        }>
            {
                error ? (
                    <h1>Your token was expired</h1>
                ) : (
                    <h1>Account activated successfully</h1>
                )
            }
        </div>
    )
}

export default ActivationPage
