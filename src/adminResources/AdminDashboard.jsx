import './AdminDashboard.css';
import { UserButton } from '@clerk/clerk-react';
import DashboardSwitcher from './adminProps/DashboardSwitcher.jsx'; //importing the dashboard switcher.
import TableOfUsers from './adminProps/TableOfUsers.jsx';
import CalenderAndEvents from './adminProps/calenderAndEvents.jsx';
import EmailFunctionality from './adminProps/emailFunctionality.jsx';
import FacilityReports from './adminProps/FacilityReports.jsx';
import BookingImplementation from './adminProps/bookingImplementaion.jsx';
import { useEffect } from 'react';
import { useState } from 'react';


let globalVar;
export default function AdminDashboard() {

    const [showArr, setShowArr] = useState(['none', 'none', 'none', 'none', 'none', 'none']);

    useEffect(() => {
        const ids = ["all", "stats", "TableOfUsers", "calender&Events", "issues", "emails"];
        ids.forEach((id, index) => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = showArr[index];
            }
        });
    }, [showArr]); // Re-run when `showArr` changes

    const navigateTo = (target) => {    
    const updatedArr = showArr.map((_, i) => (i === target ? "block" : "none"));
    setShowArr(updatedArr); // Triggers a re-render
    };


    return(
        <main className='adminDashBoardBody' >
        <h1 className='adminDashboard'>Admin Dashboard</h1>

        <ul className='adminDashboardNav'>
            <li><button id='allProps' className='propsNav' onClick={()=>navigateTo(0)}>All</button></li>
            <li><button id='statistics' className='propsNav' onClick={()=>navigateTo(1)}>Statistics</button></li>
            <li><button id='users' className='propsNav' onClick={()=>navigateTo(2)}>Users</button></li>
            <li><button id='calenderAndEvents' className='propsNav' onClick={()=>navigateTo(3)}>Events&Calender</button></li>
            <li><button id='reports' className='propsNav' onClick={()=>navigateTo(4)}>Reports</button></li>
            <li><button id='email' className='propsNav' onClick={()=>navigateTo(5)}>Email</button></li>
        </ul>

        <section className='userButton'><UserButton/></section>

        <section>
                <BookingImplementation/>
                <section id='bookings' className='bookings'></section>
        </section>
        

        <section className='all' id='all' >

            <DashboardSwitcher />
           
            <TableOfUsers/>
            
            <CalenderAndEvents/>
            
            <section className='issuesAndEmails'>
                <FacilityReports/>
                <EmailFunctionality/>
            </section>
        </section>
        <section id='stats' className='functionalElements' ><DashboardSwitcher/></section>
        <section id='TableOfUsers' className='functionalElements'><TableOfUsers/></section>
        <section id='calender&Events' className='functionalElements'><CalenderAndEvents/></section>
        <section id='issues' className='functionalElements'><FacilityReports/></section>
        <section id='emails' className='functionalElements'><EmailFunctionality/></section>
        
        </main>
    )
}