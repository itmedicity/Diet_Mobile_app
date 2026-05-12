import { Box } from "@mui/joy";
import React, { memo } from "react";
import NursingStationInfo from "../../components/NursingStationInfo";
import LiveClock from "../../components/LiveClock";

const NursingStaionHeader = ({ stationname, bed }) => {

    return (
        <Box
            sx={{
                width: "100%",
                height: 50,
                bgcolor: "white",
                boxShadow: "sm",
                display: "flex",
                alignItems: "center",
                justifyContent: 'space-around',
                gap: 3,
                position: "sticky",
                top: 0,
                zIndex: 1100
            }}>
            <Box sx={{ width: '40%' }}>
                <NursingStationInfo station={stationname} bed={bed} />
            </Box>
            <Box sx={{ width: '40%' }}>
                <LiveClock />
            </Box>

        </Box>
    );
};

export default memo(NursingStaionHeader);
