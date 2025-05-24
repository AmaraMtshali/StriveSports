import './facilityStaff.css';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import removeConfigMenu from '../adminResources/removeConfigMenu';
import { UserButton } from '@clerk/clerk-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { formatDate } from '@fullcalendar/core';
import { useRef } from 'react';
import getEvents from '../adminResources/getEvents';
import getReports from '../adminResources/getReports';
import updateStatus from '../adminResources/updateStatus';
import updateReportStatus from '../adminResources/updateReportStatus';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getemails from '../adminResources/getemails';

let globalVar;
export default function FacilityStaff() {

    //creating the report table 
    const [rows, setRows] = useState([]);

    useEffect(() => {
        getReports().then((data) => {
            const processedRows = data.map(element => ({
                id: element._id,
                facility: element.facility,
                issue: element.issue,
                residentInfo: element.residentInfo,
                status: element.status,
                __v: element.__v,
            }));

            setRows(processedRows); //Updates state, triggering re-render
        });
    }, []);

    //Role update functionality
    const roleChange = (row) => {
        const configMenu = document.getElementById('configMenu');
        configMenu.style.left = '40%';
        globalVar = row.id;
    }

    //calendar functionality
    const calendarRef = useRef(null);
    //Calender on click event
    const [currentEvent, setCurrentEvent] = useState([]);

    const handleEventClick = (clickInfo) => {
        if (window.confirm(`event details...`)) {
        }
    }

    //updating events on the calendar  { id: '1', title: 'Meeting', start: '2025-05-02T09:00:00', end: '2025-05-02T10:00:00' }
    useEffect(() => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            
            getEvents().then((data) => {
                data.forEach((element) => {
                    calendarApi.addEvent({
                        id: element.id,
                        title: element.event,
                        start: `${element.date}T${element.time_from}`,
                        end: `${element.date}T${element.time_to}`,
                        description: element.event_description,
                    });
                });
            });
        }
    }, [calendarRef]); // Add `calendarRef` as a dependency

    let statusN
    const ReportStatus = async (status) => {
        const messageBox = document.querySelector('.messageDetails');
        messageBox.style.display = 'block';
      
        const selectedReport = rows.find(row => row.id === globalVar);
        if (!selectedReport) {
            toast.error('No report selected');
            return;
        }
      
        statusN = status;
      
        let subject, message;
      
        if (status === 'In progress') {
            subject = `Facility Closed: ${selectedReport.facility}`;
            message = `Dear StriveSports Community Member,<br/><br/>
                Please note that the <strong>${selectedReport.facility}</strong> is currently <strong>closed until further notice</strong>.<br/><br/>
                Our staff is working diligently to ensure the facility is safe for use.<br/>
                All existing bookings for the <strong>${selectedReport.facility}</strong> have been cancelled and no new bookings will be permitted for the foreseeable future.<br/><br/>
                We appreciate your understanding and will notify you once the facility is available again.`;
        } else if (status === 'Done') {
            subject = `Facility Reopened: ${selectedReport.facility}`;
            message = `Dear StriveSports Community Member,<br/><br/>
                Thank you for your patience.<br/>
                We're happy to inform you that the <strong>${selectedReport.facility}</strong> is now <strong>open and available for use</strong> again.<br/><br/>
                You may resume booking this facility as normal.`;
        }
      
        try {
            // First update the report status
            await updateReportStatus(globalVar, status, "");
            
            // Only send emails if status is "In progress" or "Done"
            if (status === 'In progress' || status === 'Done') {
                try {
                    const emailData = await getemails();
                    console.log('Fetched emails:', emailData.emails);
            
                    if (!emailData.emails || emailData.emails.length === 0) {
                        toast.warning('Status updated, but no emails found to send notification.');
                        return;
                    }
            
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/emails`, { // Fixed typo here
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            subject,
                            message,
                            emails: emailData.emails,
                        }),
                    });
            
                    if (!response.ok) {
                        throw new Error('Failed to send emails');
                    }
            
                    toast.success(`Status updated and email notification sent (${status})`);
                } catch (emailError) {
                    console.error('Email error:', emailError);
                    toast.error(`Status updated but email failed: ${emailError.message}`);
                }
            } else {
                toast.success(`Status updated to ${status}`);
            }
        } catch (updateError) {
            console.error('Status update error:', updateError);
            toast.error(`Failed to update status: ${updateError.message}`);
        }
    };
    
    const continue1 = () => {
        const messageBox = document.querySelector('.messageDetails');
        const input = document.querySelector('#eventText');
        const message = input.value;
        input.value = '';

        updateReportStatus(globalVar, statusN, message);
        messageBox.style.display = 'none';
    }


    //Menu update functionality


    return(
        <main className='facilityStaff'>
        <h1 className='adminDashboard'>Facility Staff</h1>
        
        <section className='configMenu' id='configMenu'>
            <button onClick={()=>{removeConfigMenu();ReportStatus('Pending')}} className='updateRole'>Pending</button>
            <button onClick={()=>{removeConfigMenu();ReportStatus('In progress')}} className='updateRole'>In progress</button>
            <button onClick={()=>{removeConfigMenu();ReportStatus('Done')}} className='updateRole'>Done</button>
            <button onClick={removeConfigMenu} className='updateRole'>Cancel</button>
        </section>

        <section>
            <section className='userButton'>
                <UserButton></UserButton>
            </section>
        </section>

        <section className='usersTable'>
        <Box>
            <DataGrid
                rows={rows}
                columns={[
                    { field: 'facility', headerName: 'facility', flex: 1 },
                    { field: 'issue', headerName: 'issue', flex: 4 },
                    { field: 'status', headerName: 'status', flex: 1,

                        renderCell: (params) => (
                            <button onClick={() => roleChange(params.row)}>
                                {params.value}
                            </button>
                        ),
            
                     },
                ]}
                pageSize={5}
                rowsPerPageOptions={[5]}
                sx={{
                    "& .MuiDataGrid-root": { fontFamily: "Arial, sans-serif" },
                    "& .MuiDataGrid-cell": { fontSize:{
                        xs: "0.7rem",
                        sm: "0.8rem",
                        md: "0.9rem",
                        lg: "1rem",
                      },},
                }}
            
                
            />
        </Box>
        </section>
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
                    eventClick={handleEventClick}
                    eventsSet={(events) => setCurrentEvent(events)}
                ></FullCalendar>
            </Box>

            <Box className='messageDetails'>
                            <h3>Feedback bar</h3>
                            <textarea name="eventDetails" className='input' id="eventText"></textarea>
                            <Box className='eventDetailsButton'>
                            <button className='done' onClick={()=>continue1()}>send</button>
                            <button className='done' onClick={()=>continue1()}>skip</button>
                            </Box>
            </Box>
            
        </section>
        </main>
    )
}