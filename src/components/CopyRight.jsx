import { Box } from '@mui/joy'
import React from 'react'
import TextComponent from './TextComponent'

const CopyRight = () => {
    return (
        <Box sx={{
            width: '100%',
            position: 'absolute',
            bottom: 10,
            textAlign: 'center'
        }}>.
            <TextComponent color={'#9a9a9a'} value={"Copyright © 2026 Travancore Medicity. All Right Reserved"} size={8} />
        </Box>
    )
}

export default CopyRight