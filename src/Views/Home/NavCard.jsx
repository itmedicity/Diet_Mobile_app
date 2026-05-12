import { Box } from '@mui/joy'
import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import TextComponent from '../../components/TextComponent'

const NavCard = ({
    label, path, icon: Icon
}) => {
    const navigate = useNavigate()


    // Navigate to Certain Path
    const handleNavigate = () => {
        navigate(path)
    }
    return (
        <Box onClick={handleNavigate} sx={{
            width: '95%',
            height: 100,
            boxShadow: 'lg',
            mb: 1,
            borderRadius: 5,
            bgcolor: "rgb(252, 248, 254)",
            cursor: "pointer",
            border: "1px solid rgb(177, 38, 236)",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        }}>
            <Icon />
            <TextComponent color={'#000000'} value={label} size={14} weight={800} />
        </Box>
    )
}

export default memo(NavCard)