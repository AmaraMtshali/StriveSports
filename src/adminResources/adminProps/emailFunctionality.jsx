import { Box,Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from "react";
import { toast } from 'react-toastify'; //toastify.
import { useUser } from '@clerk/clerk-react';
import getemails from '../getemails.jsx';

let globalVar;

export default function EmailFunctionality() {
    //Loading the bookings
     const { user } = useUser(); 
     const [rows2, setRows2] = useState([]); 

    //this is for the resend implementation
        const[subject, setSubject] = useState('');
        const[message, setMessage] = useState('');
        const[emailStatus, setEmailStatus] = useState('');
    
        const handleSendEmail = async (e) => {
            e.preventDefault();
            
            try {
                // Fetch the emails
                const data = await getemails();
        
                // Check if emails are present
                if (!data.emails || data.emails.length === 0) {
                    setEmailStatus('No emails found.');
                    toast.error('No emails found.');
                    return;
                }
        
                // Sending the emails
                const response = await fetch(`${import.meta.env.VITE_API_URL}/emails`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          "subject":subject,
                          "message":message,
                          "emails":data.emails
                      }),
                    });
                
                    const result = await response.json();
                    
                    if (response.ok) {
                      setEmailStatus('Emails sent successfully!');
                      toast.success('Emails sent successfully!');
                    } else {
                      setEmailStatus(`Failed: ${result.error}`);
                      toast.error('Email failed to send.');
                    }
                  } catch (error) {
                    console.error('Error sending emails:', error);
                    setEmailStatus('Email sending failed due to server error.'+ error);
                    toast.error('Email failed to send due to server error.');
                  }
        }
    return(
        
        <section className='email-section'>
        <Box sx={{ margin: '50px', padding: '70px', backgroundColor: '#f4f6f8', borderRadius: '15px' }}>
                        <Typography variant="h6" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
                            Communication Center
                        </Typography>
                        <form onSubmit={handleSendEmail}>
                            <input
                            type="text"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            style={{
                                width: '100%',
                                marginBottom: '20px',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                backgroundColor: '#fff',
                                fontSize: '16px',
                                color: '#000',         
                                caretColor: '#000',
                            }}
                            required
                            />
                            <textarea
                            placeholder="Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                                width: '100%',
                                height: '120px',
                                marginBottom: '20px',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                backgroundColor: '#fff',
                                fontSize: '16px',
                                color: '#000',         
                                caretColor: '#000',
                            }}
                            required
                            ></textarea>
                            <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                borderRadius: '5px',
                                border: 'none',
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                cursor: 'pointer',
                            }}
                            >
                            Send Emails
                            </button>
                        </form>
                        {emailStatus && (
                            <Typography sx={{ marginTop: '20px' }}>{emailStatus}</Typography>
                        )}
                    </Box>          

        </section>
    )
}