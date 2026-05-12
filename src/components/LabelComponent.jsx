import React, { memo } from 'react'
import TextComponent from './TextComponent';
import { Box } from '@mui/joy';

const LabelComponent = ({ name = "label", mandatory }) => {
    return (
        <Box
            sx={{
                minWidth: 150,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 0.5
            }}
        >
            <TextComponent value={name} size={15} />
            {
                mandatory &&
                <span
                    style={{
                        color: 'red',
                        fontSize: 12,
                        position: 'relative',
                        top: -4
                    }}
                >
                    *
                </span>
            }

        </Box>
    )
}

export default memo(LabelComponent);
