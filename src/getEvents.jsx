async function getEvents(){
    return [
        {
            id: '10',
            event:'Event things',
            date:'2025-05-06',
            time_from:'09:00',
            time_to:'12:00', 
            event_description:'meeting',
        },
        {
            id: '20',
            event:'Event things again',
            date:'2025-05-12',
            time_from:'09:00',
            time_to:'12:00', 
            event_description:'meeting',
        },
    ]
}

export default getEvents;