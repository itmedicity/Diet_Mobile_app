import Axios from 'axios'
import { API_URL } from '../Views/Constant/Static'
import { warningNofity } from '../Views/Constant/Constant'


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


// Session expiry, handled in ONE place. Until now only a few screens called handleAuthError, so on
// the others an expired login just showed "Something went wrong". A 401 from any request (except the
// login call and the token check, which handle it themselves) clears the stored login and returns to
// the login page, once. 403 ("no permission") is NOT handled here: the screens show the server's message.
let sessionExpiryHandled = false;

axioslogin.interceptors.response.use(
    (response) => response,
    (error) => {

        const status = error?.response?.status;
        const url = String(error?.config?.url || '');

        const handledElsewhere =
            url.includes('/validateAccessToken') ||
            url.includes('/user/checkUserCres');

        const onLoginPage = window.location.pathname === '/';

        // The login cookie is shared by every app on the same host (cookies ignore the port), so logging in
        // as someone else in another tab / the web app replaces it while this app still holds the old
        // employee id. The server then answers 403 USER_MISMATCH: ask for a fresh login.
        const userMismatch = status === 403 && error?.response?.data?.code === 'USER_MISMATCH';

        if ((status === 401 || userMismatch) && !handledElsewhere && !onLoginPage && !sessionExpiryHandled) {

            sessionExpiryHandled = true;

            warningNofity(userMismatch
                ? 'You are logged in as a different user in another tab. Please login again'
                : 'Session expired. Please login again');

            try {
                localStorage.removeItem('app_auth');
            } catch (storageError) {
                // storage can be blocked in private windows; the redirect below still works
            }

            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }

        return Promise.reject(error);
    }
)
