import Axios from 'axios'
import { API_URL } from '../Views/Constant/Static'


// CONNECTION TO THE MELIORA MYSQL DATABASE

export const axioslogin = Axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': 'en-GB,en'
    }
})
