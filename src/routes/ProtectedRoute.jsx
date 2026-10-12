// @ts-nocheck
import React, { memo } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useValidateToken from '../hooks/useValidateToken'
import { Backdrop, CircularProgress } from '@mui/material'
import FloatingBackButton from '../components/FloatingBackButton';
import BottomNav, { NAV_PATHS, NAV_HEIGHT } from '../components/BottomNav';
import { Box } from '@mui/joy';

const ProtectedRoute = () => {
    const { isValid, isLoading } = useValidateToken()
    const { pathname } = useLocation()
    const showNavSpace = NAV_PATHS.includes(pathname) && pathname !== '/dashboard'

    // token check in progress: show a spinner (previously a "Return Home" button
    // flashed here because isValid starts as false)
    if (isLoading) {
        return (
            <Backdrop
                sx={{ zIndex: 1 }}
                open={isLoading}
                invisible
            >
                <CircularProgress />
            </Backdrop>
        );
    }

    // token invalid or expired: back to the login page
    if (!isValid) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            {/* room for the bottom bar so it never covers the end of a list (the dashboard fits on one screen) */}
            <Box sx={{ pb: showNavSpace ? `calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom))` : 0 }}>
                <Outlet />
            </Box>
            <FloatingBackButton />
            <BottomNav />
        </>
    );
}

export default memo(ProtectedRoute)
