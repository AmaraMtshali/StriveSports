export default async function getUserById(userId) {//returns 0 when user not found
    const user = await fetch(`${import.meta.env.VITE_VERCEL_URL}/user/byId`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "id" : userId })
    })
    const data = await user.json();
    return data;
}