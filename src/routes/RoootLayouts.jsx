// @ts-nocheck
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { succesNofity, errorNofity, sanitizeInput, warningNofity } from '../Views/Constant/Constant';
// import { axiosApi } from '../Axios/axios';
import Login from '../Views/UserAuthentication/Login';
import { axioslogin } from '../Axios/axios';

// import CopyRight from '../Components/CopyRight';
// const LoginlogoHeader = lazy(() => import("../Components/LoginlogoHeader"))

const RoootLayouts = () => {
  const navigate = useNavigate();

  // const userDetl = localStorage.getItem('app_auth');

  const [userInput, setUserInput] = useState({
    empid: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    empidError: '',
    passwordError: ''
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    // never sanitise the password: DOMPurify would HTML-encode characters like & and <
    // and the user could then never log in with it. It is sent as JSON, not rendered.
    const sanitizedValue = name === "password" ? value : sanitizeInput(value);
    handleError(name, sanitizedValue);
    setUserInput((prev) => {
      return { ...prev, [name]: sanitizedValue }
    })
  }, []);

  const handleError = (name, value) => {
    if (name === "empid") {
      if (value === "") {
        setErrors((prev) => ({
          ...prev,
          empidError: "The field is empty"
        }))
      } else {
        setErrors((prev) => ({
          ...prev,
          empidError: ""
        }))
      }
    }
    if (name === "password") {
      if (value === "") {
        setErrors((prev) => ({
          ...prev,
          passwordError: "The password field is empty"
        }))
      } else {
        setErrors((prev) => ({
          ...prev,
          passwordError: ""
        }))
      }
    }
  };

  const postData = useMemo(() => {
    return {
      userName: userInput?.empid,
      passWord: userInput?.password,
      method: 1
    }
  }, [userInput])


  // login form
  const handleloginform = useCallback(async () => {
    try {
      if (userInput?.empid === null || userInput?.empid === undefined || userInput?.empid === "") {
        setErrors((prev) => ({
          ...prev,
          empidError: "Employee Id Field is required"
        }))
        return;
      }

      if (userInput?.password === null || userInput?.password === undefined || userInput?.password === "") {
        setErrors((prev) => ({
          ...prev,
          passwordError: "Password Field is required"
        }));
        return;
      }

      const result = await axioslogin.post("/user/checkUserCres", postData, { withCredentials: true })
      const { message, success, userInfo } = result?.data;
      if (success === 0) {
        errorNofity(message); // database error
      } else if (success === 1) {
        warningNofity(message); // incorrected credientials
      } else if (success === 2) {
        succesNofity(message); // credential verified
        // The access token lives in the httpOnly cookie (withCredentials), so it is
        // no longer copied into localStorage. btoa is only Base64 encoding, not encryption.
        const { empdtl_slno, login_method_allowed, emp_id } = JSON.parse(userInfo);
        const authData = {
          authNo: btoa(empdtl_slno),
          authType: btoa(login_method_allowed),
          authId: btoa(emp_id)
        };
        localStorage.setItem("app_auth", JSON.stringify(authData));
        navigate("/dashboard", { replace: true });
      } else {
        errorNofity(message);
      }
    } catch (error) {
      warningNofity(error?.response?.data?.message || error?.message || "Unable to login")
    }
  }, [postData, userInput, navigate]);



  // the login page lays itself out (full height, centred column), so it is rendered directly
  return (
    <Login
      handlelogin={handleloginform}
      onChange={handleChange}
      value={userInput}
      errors={errors}
    />
  );
};
export default memo(RoootLayouts);
