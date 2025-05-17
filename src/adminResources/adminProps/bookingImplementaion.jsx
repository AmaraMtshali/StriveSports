import getBookings from '../getBookings.jsx';
import updateStatus from '../updateStatus.jsx';
import deleteBooking from '../deleteBooking.jsx';


export default function BookingImplementation() {
     //the bookings variable is used to store the bookings data
    let bookings;
    
    getBookings().then((data) => {
        //DOM Manipulation
        let menu = document.getElementById('bookings');
        menu.innerHTML = '';
        for (let booking of data) {
            if ( booking.status === 'rejected') {
                deleteBooking(booking._id);
            }

            const bookingRow = document.createElement('ul');

            

            const sport = document.createElement('li');
            const time = document.createElement('li');
            const date = document.createElement('li');
            const status = document.createElement('li');

            sport.innerText = booking.sport;
            time.innerText = booking.time;
            date.innerText = booking.date;
            status.innerText = booking.status;
            

            bookingRow.className = 'bookingRow';
            status.className = 'bookingStatus';


            bookingRow.addEventListener('click', () => {//onclick Functionality for each row
                if (status.innerText === 'pending') {
                    status.innerText = 'approved';
                    updateStatus(booking._id, 'approved');
                    status.style.backgroundColor = 'lime';

                } else if (status.innerText === 'approved') {
                    status.innerText = 'rejected';
                    updateStatus(booking._id, 'rejected');
                    status.style.backgroundColor = 'red';

                } else if (status.innerText === 'rejected') {

                    status.innerText = 'pending';
                    updateStatus(booking._id, 'pending');
                    status.style.backgroundColor = 'aquamarine';
                }
                else{
                    alert('Unexpected status');
                }
            })

            //color update
        {
            if (status.innerText === 'approved') {
                status.innerText = 'approved';
                status.style.backgroundColor = 'lime';

            } else if (status.innerText === 'pending') {

                status.innerText = 'pending';
                status.style.backgroundColor = 'aquamarine' ;
            }
        }

            bookingRow.appendChild(sport);
            bookingRow.appendChild(time);
            bookingRow.appendChild(date);
            bookingRow.appendChild(status);
            menu.appendChild(bookingRow);
        }
        
    })


    //Loading the bookings
    function loadBookings(){
        
        const bookingMenu = document.getElementById('bookings');
        const button = document.querySelector('.bookingsMenuButt');
        if (bookingMenu.style.left === '0px'){
            bookingMenu.style.left = '-125vw';
            button.style.right = '1%';
        }
        else{
            bookingMenu.style.left = 0;
            
        }
    }
    return (
        <button onClick={loadBookings} className='bookingsMenuButt'>Booking</button>
    )
}