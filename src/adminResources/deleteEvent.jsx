export default async function deleteEvent() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/events`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return;
}