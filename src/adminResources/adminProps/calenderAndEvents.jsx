import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import getEvents from '../getEvents.jsx';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import { formatDate } from '@fullcalendar/core/index.js';
import { useRef } from 'react';

let globalVar;

export default function CalenderAndEvents() {

    //Calender
    const calendarRef = useRef(null);
    const [currentEvent, setCurrentEvent] = useState([]);

    //Load Events to calendar
    useEffect(() => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            
            getEvents().then((data) => {
                for (let element of data){
                    calendarApi.addEvent({
                        id: element._id,
                        title: element.event,
                        start: `${element.date}T${element.time_from}`,
                        end: `${element.date}T${element.time_to}`,
                        description: element.event_description,
                    });
                }
            });
        }
    }, [calendarRef]);

    //handle event add and cancel

    const handleEventAdd = async () => {
        const eventDetails = document.getElementById('eventDetails');
        const eventName = document.getElementById('eventName').value;
        const timePick = document.getElementById('timePick').value;
        const timeEnd = document.getElementById('timeEnd').value;
        const eventText = document.getElementById('eventText').value;
        const date = globalVar;
    
        const calendarApi = date.view.calendar;
        calendarApi.unselect(); // clear date selection
    
        if (eventName && timePick && timeEnd) {
            eventDetails.style.zIndex = -1;
    
            // 1. Add event to calendar
            calendarApi.addEvent({
                title: eventName,
                start: `${date.startStr}T${timePick}`,
                end: `${date.startStr}T${timeEnd}`,
                eventDetails: eventText || 'No details'
            });
    
            handleEventCancel();
    
            
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/events`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "event": eventName,
                        "date": date.startStr,
                        "time_from": timePick,
                        "time_to": timeEnd,
                        "event_description": eventText || 'No details'
                    }),
                });
            } catch (err) {
                console.error('Failed to save event to server:', err);
            }
    
            
            const subject = `Upcoming Event: ${eventName}`;
            const message = `Dear StriveSports Community member,<br/><br/>
            You’re invited to our upcoming event:<br/><br/>
            <strong>Event:</strong> ${eventName}<br/>
            <strong>Date:</strong> ${date.startStr}<br/>
            <strong>Time:</strong> ${timePick} – ${timeEnd}<br/><br/>
            ${eventText || 'No additional details provided.'}<br/><br/>
            Can’t wait to see you there!`;
    
            
            try {
                const data = await getemails();
                console.log('Fetched emails:', data.emails);
    
                if (!data.emails || data.emails.length === 0) {
                    toast.error('No emails found.');
                    return;
                }
    
                const response = await fetch(`${import.meta.env.VITE_API_URL}/emails`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subject,
                        message,
                        emails: data.emails
                    }),
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    toast.success('Event created and emails sent!');
                } else {
                    toast.error(`Email failed: ${result.error}`);
                }
            } catch (error) {
                console.error('Error sending emails:', error);
                toast.error('Email sending failed due to server error.');
            }
        } else {
            alert('At least the event name and times must be provided.');
        }
    };
    //event cancelation
    const handleEventCancel = () => {
        const eventDetails = document.getElementById('eventDetails');
        eventDetails.style.display = 'none';
        const eventName = document.getElementById('eventName').value = '';
        const timePick = document.getElementById('timePick').value = '';
        const timeEnd = document.getElementById('timeEnd').value = '';
        const eventText = document.getElementById('eventText').value = '';

    }

    //date click functionality
    const handleDateClick = (date) => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

        const dateSelected = date.startStr.split('-');
        const todayDate = formattedDate.split('-');

        let selected;
        let current;

        let returnValue = false;
        let greatMonth = false;
        let greatYear = false;
        for (let i=0; i<3; i++){
            
            selected = parseInt(dateSelected[i]);
            current = parseInt(todayDate[i]);

            if (i ===0){
                if (selected < current){
                    returnValue = true;
                }
                if (selected > current){
                    greatYear = true;
                }
            }
            else if (i === 1){
                if (selected < current && !greatYear){
                    returnValue = true;
                }
                if (selected > current){
                    greatMonth = true;
                }
            }
            else if (i === 2){
                if (selected <= current && !greatMonth && !greatYear){
                    returnValue = true;
                }
            }

            if (returnValue){
                alert('You cannot select a date before tomorrow');
                return;
            }
        }
        

        const eventDetails = document.getElementById('eventDetails');
        eventDetails.style.display = 'block';
        globalVar = date;
        localStorage.setItem('eventDate', date);
    }

    //event click functionality
    const handleEventClick = (clickInfo) => {
        if (window.confirm(`Are you sure you want to delete this event?`)) {
            clickInfo.event.remove();
        }
    }
    const getemails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/useremails`);
            const data = await response.json();
            return data; // Assuming the response contains an object with "emails" array
        } catch (error) {
            console.error("Error fetching emails:", error);
            throw new Error("Failed to fetch emails");
        }
    };

    return (
        <>
        <section className='calenderAndBookings'>
            <Box className='bookingsBox'>
                <header title='Calendar' className='header'></header>
                <Box flex="1 1 20%">
                    <Typography variant="h4">Events</Typography>
                    <List>
                        {currentEvent.map((event) => (
                            <ListItem
                            key = {event.id}
                            sx = {{ backgroundColor: 'aqua', padding: 2, margin: 1, borderRadius: 2 }}

                            >

                        <ListItemText
                            primary={event.title}
                            secondary={
                                <Typography>
                                  {formatDate(event.start, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                  {" | "}
                                  {formatDate(event.start, { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })} - {formatDate(event.end, 
                                  { hour: '2-digit', minute: '2-digit' })}
                                </Typography>

                            }
                        ></ListItemText>
                        </ListItem>
                        )
                        )}
                    </List>
                </Box>
            </Box>

            <Box className='calenderBox'>
                <FullCalendar
                    ref={calendarRef}
                    height='75vh'
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    initialView='dayGridMonth'
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    select={handleDateClick}
                    eventClick={handleEventClick}
                    eventsSet={(events) => setCurrentEvent(events)}
                ></FullCalendar>
            </Box>
            
            
        </section>
        <Box className='eventDetails' id='eventDetails'>
                <h3>Date: </h3>
                <h3>Event name:</h3>
                <input title='hello' type="text" className='input' id='eventName'/>
                <h3>Event Time start:</h3>
                <input aria-label="Time" type="time" className='input' id='timePick'/>
                <h3>Event Time end:</h3>
                <input aria-label="Time" type="time" className='input' id='timeEnd'/>
                <h3>Event Details:</h3>
                <textarea name="eventDetails" className='input' id="eventText"></textarea>
                <Box className='eventDetailsButton'>
                <button className='done' onClick={()=>handleEventAdd()}>Add Event</button>
                <button className='done' onClick={()=>handleEventCancel()}>Cancel</button>
                </Box>
        </Box>
        </>
    )
}