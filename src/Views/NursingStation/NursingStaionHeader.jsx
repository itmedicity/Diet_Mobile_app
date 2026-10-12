import { Box } from "@mui/joy";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NursingStationInfo from "../../components/NursingStationInfo";
import LiveClock from "../../components/LiveClock";
import { COLORS, focusRing } from "../../Style/designTokens";
import { HEADER_HEIGHT } from "../../components/LoginEmployeeHeader";

const NursingStaionHeader = ({ stationname, bed }) => {
    const navigate = useNavigate();

    return (
        <Box
            component="header"
            sx={{
                width: "100%",
                height: HEADER_HEIGHT,
                boxSizing: "border-box",
                px: 1,
                bgcolor: COLORS.white,
                borderBottom: `1px solid ${COLORS.line}`,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                position: "sticky",
                top: 0,
                zIndex: 1100
            }}>
            <Box
                component="button"
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Go back"
                sx={{
                    flexShrink: 0, width: 44, height: 44, border: 0, bgcolor: "transparent", cursor: "pointer",
                    borderRadius: "50%", display: "grid", placeItems: "center", color: COLORS.ink,
                    ...focusRing,
                }}
            >
                <ArrowBackRoundedIcon />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <NursingStationInfo station={stationname} bed={bed} />
            </Box>

            <Box sx={{ pr: 1 }}>
                <LiveClock />
            </Box>
        </Box>
    );
};

export default memo(NursingStaionHeader);
