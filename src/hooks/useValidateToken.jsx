// @ts-nocheck
import { useEffect, useState } from "react";
import { warningNofity } from "../Views/Constant/Constant";
import { axioslogin } from '../Axios/axios';
const useValidateToken = () => {

    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controler = new AbortController();
        const validateToken = async () => {
            setIsLoading(true);
            try {
                const res = await axioslogin.get("/validateAccessToken", {
                    signal: controler.signal
                });
                console.log({res});
                

                if (res.status === 200) {
                    const { isValidToken } = res.data;
                    setIsValid(isValidToken);
                } else {
                    setIsValid(false);
                }
            } catch (e) {
                // console.log("Error validating token:", e);
                warningNofity("Please Login to Continue..!")
                localStorage.removeItem("app_auth"); // REMOVE THE AUTH VALUES
                controler.abort()
                setIsValid(false);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();

    }, []);

    return { isValid, isLoading }

}

export default useValidateToken