import { Typography } from '@mui/joy';
import React, { memo } from 'react'

const TextComponent = ({
    size = 16,
    weight = 500,
    value,
    fam = 'Bahnschrift',
    color = 'black',
    noWrap,
    wrap = false
}) => {
    return (
        <Typography
            sx={{
                fontSize: size,
                fontWeight: weight,
                color: color,
                fontFamily: fam,
                ...(!wrap && {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }),
                ...(noWrap && {
                    wrap: "wrap",
                }),

                ...(noWrap && {
                    width: '100%',
                })

            }}
        >
            {value}
        </Typography>
    )
}

export default memo(TextComponent)






