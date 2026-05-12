import { Avatar, Box } from '@mui/joy'
import TextComponent from './TextComponent'
import React, { memo } from 'react'
import { format } from 'date-fns';

const PatientInfoCard = ({ PatientDetail }) => {

    //  Get first letter safely
    const getInitial = (name) => {
        if (!name) return "";
        return name.trim().charAt(0).toUpperCase();
    };

    //  Format date to YYYY-MM-DD HH:mm:ss
    const formatDateTime = (dateString) => {
        if (!dateString) return "";

        try {
            return format(new Date(dateString), "yyyy-MM-dd HH:mm:ss");
        } catch (error) {
            return "";
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: 'center',
                mt: 2
            }}
        >
            <Box
                sx={{
                    width: '90%',
                    bgcolor: '#ffffff',
                    boxShadow: "sm",
                    height: '90%',
                    borderRadius: 5,
                    p: 1,
                    display: "flex",
                    gap: 1,
                    borderLeft: "2px solid #9d25b8",
                    borderRight: '2px solid #9d25b8',
                    justifyContent: 'space-between'
                }}
            >

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Avatar
                        sx={{
                            bgcolor: "#9d25b8",
                            width: 35,
                            height: 35,
                            fontWeight: 600,
                            color: 'white',
                        }}
                    >
                        {getInitial(PatientDetail?.ptc_ptname)}
                    </Avatar>

                    <Box>
                        <TextComponent
                            value={PatientDetail?.ptc_ptname}
                            color='black'
                            size={12}
                            weight={800}
                        />
                        <TextComponent
                            value={PatientDetail?.pt_no}
                            color='black'
                            size={10}
                            weight={600}
                        />
                    </Box>
                </Box>

                <TextComponent
                    value={formatDateTime(PatientDetail?.ipd_date)}
                    color='black'
                    size={8}
                    weight={400}
                />
            </Box>
        </Box>
    )
}

export default memo(PatientInfoCard)