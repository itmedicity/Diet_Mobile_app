import { Box } from '@mui/joy'
import React from 'react'
import TextComponent from './TextComponent'

const LoginButton = ({
    onClick
}) => {
    return (
        <Box
            onClick={onClick}
            sx={{
                width: "100%",
                height: 40,
                borderRadius: 20,
                bgcolor: '#be55ff',
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',

                '&:hover': {
                    bgcolor: '#7b1fa2',
                    transform: 'scale(1.03)',
                    boxShadow: 'lg'
                },

                '&:active': {
                    transform: 'scale(0.97)'
                }
            }}
        >
            <TextComponent color={'#fff'} value="Login Here" />
        </Box>
    )
}

export default LoginButton
