async function getEvents() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/events`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await response.json();
    return data;
}

export default getEvents;