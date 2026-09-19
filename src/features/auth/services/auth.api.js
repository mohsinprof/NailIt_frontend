import axios from "axios";

const api = axios.create({
    baseURL: 'https://150.136.170.112.sslip.io',
    withCredentials: true

})


export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })
        console.log("backend saying :)", response.data.message)
        return response.data
    } catch (e) {
        const realmessage = e.response?.data?.message || e.message || "An error occurred";
        throw new Error(realmessage);
    }
}
export async function login({ email, password }) {
    
    try {
        const response = await api.post('/api/auth/login', {
            email, password
        })
            console.log("backend saying :)", response.data.message)
        return response.data
    } catch (e) {
        const realmessage = e.response?.data?.message || e.message || "An error occurred";
        throw new Error(realmessage);
    }
}
export async function logout() {
    try {
        const response = await api.get('/api/auth/logout', {
        })
        return response.data
    } catch (e) {
        console.log(e)
    }
}
export async function getme() {
    try {
        const response = await api.get('/api/auth/get-me', {
            withCredentials: true
        })
            console.log("backend saying :)", response.data.message)
        
        return response.data
    }
    
    catch (e) {
        const realmessage = e.response?.data?.message || e.message || "An error occurred";
    }
}
