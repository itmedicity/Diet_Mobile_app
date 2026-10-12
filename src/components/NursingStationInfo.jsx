import React, { memo } from "react";
import { Box } from "@mui/joy";
import { COLORS, FONT } from "../Style/designTokens";

// station name, and the bed under it when a patient's bed is open
const NursingStationInfo = ({ station = "", bed }) => {
    return (
        <Box sx={{ minWidth: 0, fontFamily: FONT }}>
            <Box sx={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {bed || station}
            </Box>
            {bed && (
                <Box sx={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {station}
                </Box>
            )}
        </Box>
    );
};

export default memo(NursingStationInfo);
