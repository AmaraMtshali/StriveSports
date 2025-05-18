import './Contacts.css';
import React from 'react';
import { Box, Typography } from '@mui/material';

function Contact() {
  return (
    <Box className="contact-section" id="contact" >
      <Box className="contact-text">
        <Typography variant="h1" component="h1">Contact Us</Typography>
        <Typography variant="body1" paragraph>
          We'd love to hear from you! Reach out to us via phone or by email.
        </Typography>

        <Typography variant="h6" sx={{ mt: 1, fontSize:18 }}>
          Phone: (123) 456-7890
        </Typography>
        <Typography variant="h6"sx={{ fontSize:19 }}>
          Email: strivesports8@gmail.com
        </Typography>
      </Box>

    </Box>
  );
}

export default Contact;