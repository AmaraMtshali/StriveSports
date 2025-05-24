const getUsers= async()=>{
    const response = await fetch(`${import.meta.env.VITE_VERCEL_URL}/users`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data
}

export default getUsers;