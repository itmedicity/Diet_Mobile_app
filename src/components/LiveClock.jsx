import React, { memo, useEffect, useState } from "react";
import { Box } from "@mui/joy";
import { format } from "date-fns";
import { COLORS, FONT } from "../Style/designTokens";

const LiveClock = () => {

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 30000); // minutes are shown, no seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ textAlign: "right", fontFamily: FONT, whiteSpace: "nowrap" }}>
            <Box sx={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, lineHeight: 1.2 }}>
                {format(time, "hh:mm a")}
            </Box>
            <Box sx={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.3 }}>
                {format(time, "EEE, dd MMM")}
            </Box>
        </Box>
    );
};

export default memo(LiveClock);
