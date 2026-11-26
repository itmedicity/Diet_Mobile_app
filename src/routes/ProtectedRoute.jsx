// @ts-nocheck
import React, { memo, useCallback } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useValidateToken from '../hooks/useValidateToken'
import { Backdrop } from '@mui/material'
import FloatingBackButton from '../components/FloatingBackButton';
import PizzaLoader from '../components/PizzaLoader';
import InvalidDietScreen from '../components/InvalidDietScreen';
import { Box } from '@mui/joy';

const ProtectedRoute = () => {
    const { isValid, isLoading } = useValidateToken()




    const handleReturnHome = useCallback(() => {
        localStorage.removeItem("app_auth");
        window.location.href = "/";
    }, [])


    if (isLoading) {
        return (
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    bgcolor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                }}
            >
                {isValid ? (
                    <PizzaLoader />
                ) : (
                    <InvalidDietScreen
                        handleReturnHome={handleReturnHome}
                    />
                )}
            </Box>
        );
    }

    if (isLoading === true && isValid === false) {
        <Navigate to="/" replace />
    }
    if (!isValid) {
        return <Navigate to="/" replace />;
    }
    return (
        <>
            <Outlet />
            <FloatingBackButton />
        </>
    );
}

export default memo(ProtectedRoute)