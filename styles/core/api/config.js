export const API_BASE_URL = 'http://localhost:3000/';// 'https://construtech-api-production.up.railway.app/'  "http://localhost:3000"

export const FETCH_OPTIONS = {
    headers: {
        'Content-Type': 'application/json',
        // Futura adição (JWT)
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
};
