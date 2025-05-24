import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton
} from "@clerk/clerk-react";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Hockey from '../assets/images/Hockey.jpg';
import Basketball from '../assets/images/Basketball.jpg';
import Netball from '../assets/images/Netball.jpg';
import Rugby from '../assets/images/Rugby.jpg';
import Swimming from '../assets/images/Swimming.jpg';
import Tennis from '../assets/images/Tennis.jpg';
import Track from '../assets/images/Track.jpg';
import Soccer from '../assets/images/NewSoccer.jpg';

import Marquee from 'react-fast-marquee';
import "@fullcalendar/common/main.css";
import './resident.css';
import axios from 'axios';
import { ToastContainer, toast,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Typography, Button, TextField, Select, MenuItem, InputLabel, FormControl,Box } from '@mui/material';
import { useUser} from '@clerk/clerk-react';


export default function Res() {
  
  const { user } = useUser();


  const [text] = useTypewriter({
    words: ['Striving.', 'Thriving.', 'Living.'],
    loop: true,
    typeSpeed: 70,
    deleteSpeed: 70,
    delaySpeed: 1500
  });

  const sportImages = {
    Tennis,
    Swimming,
    Basketball,
    Netball,
    Soccer,
    Hockey,
    Track,
    Rugby,
  };

  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [hoveredSport, setHoveredSport] = useState(null);

  //user variable for auth() and test is for storing user information.
  //  const{userId} = useAuth();
  //  const test = localStorage.getItem(userId);

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8;
    const ampm = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${ampm}`;
  });

  const [selectedFacility, setSelectedFacility] = useState('');
  const [description, setDescription] = useState('');

  const handleFacilityChange = (e) => {
    setSelectedFacility(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFacility || !description) {
      alert("Please insert all fields accurately.");
      toast.warn("Please insert all fields accurately.");
      return;
    }
    //calendar update
   
    const reportData = {
      facility: selectedFacility,
      issue: description,
      residentInfo: user?.id || "Unknown" //clerk suppose to handle this.
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reports`, {        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();

      if (response.ok) {

        toast.success("Reporting successful!");
        setSelectedFacility('');
        setDescription('');
      } else {

        alert("Reporting failed: " + result.message);

        toast.error("Reporting failed: " + result.message);
      }
    } catch (err) {
      console.error(err);

      alert("Server error while reporting.");

      toast.warn("Server error while reporting.");
    }
  };

  useEffect(() => {
    const circle = document.querySelector('.circle p');
    circle.innerHTML = circle.innerText
      .split("")
      .map(
        (char, i) =>
          `<section style="transform:rotate(${i * 10}deg)">${char}</section>`
      )
      .join("");
  }, []);
  const [approvedEvents, setApprovedEvents] = useState([]);
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const [bookingsRes, eventsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/bookings/approved`),
          fetch(`${import.meta.env.VITE_API_URL}/events`)
        ]);
  
        const bookings = await bookingsRes.json();
        const events = await eventsRes.json();
  
        // Format bookings
        const formattedBookings = bookings.map(booking => ({
          title: `${booking.sport} (${booking.time})`,
          start: booking.date, // Format: YYYY-MM-DD
          allDay: false,
          backgroundColor: '#2b18bd',
          borderColor: '#2b18bd',
        }));
  
        // Format events
        const formattedEvents = events.map(event => ({
          title: `${event.event} (${event.time_from} - ${event.time_to})`,
          start: `${event.date}T${event.time_from}`,
          end: `${event.date}T${event.time_to}`,
          allDay: false,
          backgroundColor: '#bd1896',
          borderColor: '#bd1896',
          extendedProps: {
            description: event.event_description
          }
        }));
  
        // Merge both
        const allCalendarEvents = [...formattedBookings, ...formattedEvents];
        setApprovedEvents(allCalendarEvents);
  
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
      }
    };
  
    fetchCalendarData();
  }, []);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  //get weather from weatherapi
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        const city = "Johannesburg";
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
        );
        const data = await response.json();

        setWeather({
          temp: data.current.temp_c,
          icon: data.current.condition.icon,
          text: data.current.condition.text,
        });
      } catch (error) {
        console.error("Weather fetch failed:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <>
      <SignedIn>
        <section className="app-cont">
          <section className='userButton'>
            <UserButton />
          </section>
          <section className="weather">
          {weather && (
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                backgroundColor: '#fff',
                padding: '10px 15px',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                zIndex: 1000,
              }}
            >
              <img src={weather.icon} alt={weather.text} style={{ width: 40, height: 40 }} />
              <Box ml={1}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#000' }}>
                  {weather.temp}°C
                </Typography>
                <Typography variant="body2" sx={{ textTransform: 'capitalize', color: '#444' }}>
                  {weather.text}
                </Typography>
              </Box>
            </Box>
          )}
          </section>
        
          <Box className='cont'>
            <Box className="designer-container">
            <Typography 
            variant="h1" 
            sx={{ 
              fontFamily: 'Helvetica Neue, Arial, sans-serif', 
              fontWeight: 400, 
              fontSize: { xs: '5rem', sm: '6rem', md: '8rem' }, 
              textAlign: 'left', 
              marginLeft: '1rem'
            }}
            >
              Resident,
            </Typography>
            <Typography 
            variant="h1" 
            sx={{ 
              fontFamily: 'Helvetica Neue, Arial, sans-serif', 
              fontWeight: 400, 
              fontSize: { xs: '5rem', sm: '6rem', md: '8rem' }, 
              textAlign: 'left', 
              marginLeft:'1rem'
            }}
            >
            {text} <Cursor cursorStyle="|" />
            </Typography>
            </Box>

            
            <Box className="Bookings"
            sx={{
              height: 'auto', 
              minHeight: '50vh',
              margin: '4rem auto',
              width:'100%',
              marginTop:'17vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',   
            }}>
              <Box className="book-head"
              sx={{ marginBottom: '1rem' }}>
              <Typography variant="h1" 
              sx={{ 
                fontFamily:'palmas, sans-serif', 
                fontSize: { xs: '3rem', sm: '5rem', md: '8rem',
                  textAlign:'left'
                 },
                }}>
            Book
          </Typography>
          <Typography variant="h1" 
          sx={{ 
            fontFamily: 'palmas, sans-serif', 
            fontSize: { xs: '4rem', sm: '5rem', md: '8rem' }}}>
            Venue
          </Typography>
              </Box>

              <Box className="booking-body"
              sx={{ 
                display: 'flex', 
                justifyContent: 'flex-start',
                textAlign:'left',
                alignItems: 'flex-start',}}>
                <Box className="Sports"
                sx={{ 
                  flex: { md: '0 0 auto' },
                  minWidth: { md: '300px' }, 
                  flexShrink: 0,
                  
                }} >
                
                  {["Tennis", "Swimming", "Basketball", "Netball", "Soccer", "Hockey", "Track", "Rugby"].map((sport) => (
                   <Typography
                   key={sport}
                   variant="h1"
                   sx={{ 
                    fontFamily: 'Helvetica Neue, Arial, sans-serif', 
                    cursor: "pointer" ,
                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: 'clamp(2.0rem, 3vw, 2.2rem)', lg: '3rem' },
                    textAlign: 'left',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#000',
                    },}}
                   onClick={() => setSelectedSport(sport)}
                   onMouseEnter={() => setHoveredSport(sport)}
                   onMouseLeave={() => setHoveredSport(null)}
                 >
                   {sport}
                 </Typography>
                  ))}
                </Box>

                <section className="hover-image-container">
                  {hoveredSport && (
                    <img
                      src={sportImages[hoveredSport]}
                      alt={hoveredSport}
                      className="hover-preview-image"
                    />
                  )}
                </section>
              </Box>

              {selectedSport && (
                <section className="popup-overlay" onClick={() => setSelectedSport(null)}>
                  <section className="popup" onClick={(e) => e.stopPropagation()}>
                    <h2>{selectedSport}</h2>

                    <label htmlFor="date" style={{ display: "block", marginTop: "1rem" }}>
                      Pick a date:
                    </label>
                    <DatePicker
                      id="date"
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy"
                      placeholderText="Select a date"
                      className="date-picker"
                    />

                    <label htmlFor="timeSlot" style={{ display: "block", marginTop: "1rem" }}>
                      Pick a time:
                    </label>
                    <select
                      id="timeSlot"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="time-dropdown"
                    >
                      <option value="">-- Select a time --</option>
                      {timeSlots.map((slot, idx) => (
                        <option key={idx} value={slot}>{slot}</option>
                      ))}
                    </select>

                    {selectedDate && selectedTime && (
                      <p style={{ marginTop: "1rem" }}>
                        Booking for <strong>{selectedSport}</strong> on{" "}
                        <strong>{selectedDate.toDateString()}</strong> at{" "}
                        <strong>{selectedTime}</strong>
                      </p>
                    )}

                    <button
                      className="book-button"
                      onClick={async () => {
                        if (!selectedDate || !selectedTime) {
                          toast.warn("Please select a date and time before booking.");
                          return;
                        }

                        const bookingData = {
                          sport: selectedSport,
                          date: selectedDate.toLocaleDateString('en-CA'),
                          time: selectedTime,
                          residentInfo:user?.id || "Unknown" // possibly add Clerk user ID here
                        };

                        try {
                          // Step 1: Check if the time slot is available
                          const checkResponse = await fetch(
                            `${import.meta.env.VITE_API_URL}/check-booking`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(bookingData),
                            }
                          );
                    
                          // If the time slot is taken, show an error and stop further processing
                          if (checkResponse.status === 409) {
                            const checkResult = await checkResponse.json();
                            toast.error(checkResult.message || "Time slot already booked.");
                            return;
                          }
                    
                          // Step 2: If the slot is available, proceed to book it
                          const response = await fetch(
                            `${import.meta.env.VITE_API_URL}/bookings`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(bookingData),
                            }
                          );
                    
                          const result = await response.json();
                    
                          // Handle booking success or failure
                          if (response.ok) {
                            toast.success("Booking successful!");
                          } else {
                            toast.error("Booking failed: " + (result.message || result.error));
                          }
                        } catch (err) {
                          console.error(err);
                          toast.error("Server error while booking.");
                        }
                    
                        // Reset date and time after booking attempt
                        setSelectedDate(null);
                        setSelectedTime("");
                      }}
                    >
                      Book
                    </button>
                   
                  </section>
                </section>
              )}
           </Box>

            <section className="marquee-section">
              <Marquee play>
                {Array(8).fill(<Typography variant="h5" sx={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', mx: 2 }}>
              Upcoming Events •
            </Typography>)}
              </Marquee>
            </section>

            <Box className="calendar-section" sx={{
              height: 'auto', 
              minHeight: '50vh',
              margin: '4rem auto',
              
            }}>
              <section className="calendar-heading" >
              <Typography variant="h2" 
              sx={{ 
                fontFamily: 'Helvetica Neue, Arial, sans-serif', 
                color: '#2b18bd', 
                fontWeight: 300, 
                fontSize:{ xs: '5rem', sm: '6rem', md: '8rem' },
                marginBottom: '1rem' 
              }}>Event</Typography>
          <Typography variant="h2" className="cal" 
          sx={{ 
            fontFamily: 'Helvetica Neue, Arial,sans-serif',
            fontSize: { xs: '5rem', sm: '6rem', md: '8rem' }}}>Calendar.</Typography>
              </section>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={approvedEvents}
                displayEventTime={false}
                eventClick={(info) => {
                  info.jsEvent.preventDefault();  // Prevent the default action (e.g., navigating to the event URL)
                  
                  // Extract sport and time from the event title
                  const titleParts = info.event.title.split(' (');
                  const sport = titleParts[0];
                  const time = titleParts[1].replace(')', '');  // Remove the closing parenthesis
                  
                  // Set the selected event and open the modal
                  setSelectedEvent({
                    sport,
                    date: info.event.startStr,  // Start date of the event
                    time
                  });
                  setIsEventModalOpen(true);
                }}
              />
              {isEventModalOpen && selectedEvent && (
  <section className="popup-overlay" onClick={() => setIsEventModalOpen(false)}>
    <section className="popup" onClick={(e) => e.stopPropagation()}>
      <h2>Event Details</h2>
      <p><strong>Sport:</strong> {selectedEvent.sport}</p>
      <p><strong>Date:</strong> {new Date(selectedEvent.date).toDateString()}</p>
      <p><strong>Time:</strong> {selectedEvent.time}</p>
      <button 
        className="book-button" 
        onClick={() => setIsEventModalOpen(false)}
        style={{ marginTop: '1rem' }}
      >
        Close
      </button>
    </section>
  </section>
)}
            </Box>

            <Box className="reports">
              <section className="report-head" style={{ display: 'flex', alignItems: 'center', gap: '18px',flexDirection: 'column' }}>
              <Typography variant="h2" sx={{ 
        fontFamily: 'Nimbus, sans-serif', 
        fontSize: { xs: '5rem', sm: '6rem', md: '8rem' },
        fontWeight: 400, 
        textAlign: 'center', 
        color: '#000', 
        WebkitTextStroke: '1.5px #333',
        '&:hover': { color: 'transparent' }
      }}>Report</Typography>
              <Typography variant="h2" sx={{ 
        fontFamily: 'Nimbus, sans-serif', 
        fontSize: { xs: '5rem', sm: '6rem', md: '8rem' }, 
        fontWeight: 400, 
        textAlign: 'center', 
        color: '#000', 
        WebkitTextStroke: '1.5px #333',
        '&:hover': { color: 'transparent' }
      }}>Faults</Typography>
              </section>

              <form className="report-form" onSubmit={handleReportSubmit}>
        <label htmlFor="facility">Facility</label>
        <select id="facility" value={selectedFacility} onChange={handleFacilityChange}>
          <option value="">Select Facility</option>
          <option value="Tennis Court">Tennis Court</option>
          <option value="Swimming Pool">Swimming Pool</option>
          <option value="Soccer Field">Soccer Field</option>
          <option value="Basketball Court">Basketball Court</option>
          <option value="Netball Court">Netball Court</option>
          <option value="Gym">Gym</option>
        </select>

                <label htmlFor="description">What's the issue?</label>
                <textarea
                  id="description"
                  rows="4"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="e.g. Net is torn, lights not working..."
                />

                <button type="submit" className="log-button">Log Report</button>
              </form>

              <section className="caution">
                <section className="circle">
                <Typography variant="body1">
              Caution • Report • Caution • Fault • 
            </Typography>
                </section>
              </section>
            </Box>
          </Box>
        </section>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn redirectUrl="/Components/Signup/signup" />
      </SignedOut>
      <ToastContainer
                              position="top-center"
                              autoClose={3000}
                              hideProgressBar={false}
                              newestOnTop={false}
                              closeOnClick={false}
                              rtl={false}
                              pauseOnFocusLoss
                              draggable
                              pauseOnHover
                              theme="light"
                              transition={Bounce}
                        />
    </>
    
  );
  }
