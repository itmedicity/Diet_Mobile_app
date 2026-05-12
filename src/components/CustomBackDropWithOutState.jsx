// @ts-nocheck
import { Backdrop, CircularProgress } from '@mui/material';
import React, { memo } from 'react'
import { Typography } from '@mui/joy';

const CustomBackDropWithOutState = ({ message }) => {
    return (
        <Backdrop
            sx={{
                zIndex: 1,
                bgcolor: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            open={true}
            invisible
        >
            <CircularProgress sx={{ color: 'rgba(216,75,154,1)' }} />
            <Typography sx={{ color: 'rgba(216,75,154,1)' }}>{message}</Typography>
        </Backdrop>
    )
}

export default memo(CustomBackDropWithOutState)

