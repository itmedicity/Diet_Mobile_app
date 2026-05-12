
// EmployeeInfo.jsx
import React, { memo } from "react";
import { Box } from "@mui/joy";
import TextComponent from "./TextComponent";
import ApartmentIcon from '@mui/icons-material/Apartment';

const NursingStationInfo = ({ station = "Ward A", bed }) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ApartmentIcon sx={{
                color: '#9d25b8',
            }} />
            <Box>
                {bed && <TextComponent color={'#000000'} value={bed} size={12} weight={800} />}
                <TextComponent color={!bed ? '#000000' : '#a39c9c'} value={station} size={bed ? 8 : 12} weight={800} />
            </Box>
        </Box>
    );
};

export default memo(NursingStationInfo);
