// import React, { useCallback, useState, useEffect } from "react";
// import { loadStripe } from '@stripe/stripe-js';
// import {
//     EmbeddedCheckoutProvider,
//     EmbeddedCheckout
// } from '@stripe/react-stripe-js';
// import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import { Navigate, useNavigate } from 'react-router-dom';




// const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);

// export const CheckoutForm = () => {
//     const [searchParams] = useSearchParams();
//     const appointmentId = searchParams.get("appointmentId");
//     const fetchClientSecret = useCallback(() => {
//         return axios.post("/api/payment/create-checkout-session", {
//             appointmentId
//         }).then((res) => res.data.clientSecret);
//     }, [appointmentId]);

//     const options = { fetchClientSecret };

//     return (
//         <div id="checkout">
//             <EmbeddedCheckoutProvider
//                 stripe={stripePromise}
//                 options={options}
//             >
//                 <EmbeddedCheckout />
//             </EmbeddedCheckoutProvider>
//         </div>
//     );
// };

// export const Return = () => {
//     const [status, setStatus] = useState(null);
//     const [customerEmail, setCustomerEmail] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         const queryString = window.location.search;
//         const urlParams = new URLSearchParams(queryString);
//         const sessionId = urlParams.get('session_id');

//         axios.get(`/api/payment/session-status?session_id=${sessionId}`)
//             .then(res => {
//                 setStatus(res.data.status);
//                 setCustomerEmail(res.data.customer_email);
//             });
//     }, []);

//     useEffect(() => {
//         if (status === 'complete') {

//             navigate('/');
//         }
//     }, [status, customerEmail, navigate]);

//     if (status === 'open') {
//         return <Navigate to="/checkout" />;
//     }

//     return null;
// };