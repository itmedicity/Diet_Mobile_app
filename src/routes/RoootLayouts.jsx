// @ts-nocheck
import React, { lazy, memo, Suspense, useCallback, useMemo, useState } from 'react'
import { Box, Grid, Typography } from '@mui/joy'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import { succesNofity, errorNofity, sanitizeInput, warningNofity } from '../Views/Constant/Constant';
// import { axiosApi } from '../Axios/axios';
import { Skeleton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Login from '../Views/UserAuthentication/Login';
import { axioslogin } from '../Axios/axios';

// import CopyRight from '../Components/CopyRight';
// const LoginlogoHeader = lazy(() => import("../Components/LoginlogoHeader"))

const RoootLayouts = () => {
  const isSmallHeight = useMediaQuery('(max-height: 700px)');
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
    const sanitizedValue = sanitizeInput(value);
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
        const { empdtl_slno, login_method_allowed, emp_id, token } = JSON.parse(userInfo);
        const authData = {
          authNo: btoa(empdtl_slno),//btoa() encodes a string into Base64 format.
          authType: btoa(login_method_allowed),
          authId: btoa(emp_id),
          token: btoa(token)
        };
        localStorage.setItem("app_auth", JSON.stringify(authData));
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);
      } else {
        errorNofity(message);
      }
    } catch (error) {
      warningNofity(error)
    }
  }, [postData, userInput, navigate]);



  return (
    <Grid
      container
      alignItems="stretch"
      justifyContent="center"
      sx={{
        width: '100vw',
        height: '100vh',
      }}>
      <Grid>
        <Box sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          // paddingTop: { xs: isSmallHeight ? 10 : 0 },
          alignItems: 'center',
          justifyContent: { xs: isSmallHeight ? "none" : 'center', sm: 'center', md: 'center', lg: 'center' },
          width: '100vw',

        }}>
          <Login
            handlelogin={handleloginform}
            onChange={handleChange}
            value={userInput}
            errors={errors}
          />
        </Box>
      </Grid>
    </Grid>
  );
};
export default memo(RoootLayouts);
