import React, { memo, useEffect, useState } from "react";
import { Box } from "@mui/joy";
import { format } from "date-fns";
import TextComponent from "./TextComponent";

const LiveClock = () => {

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 60000); // update every minute (no seconds needed)

        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ textAlign: "right" }}>
            <TextComponent
                color={'#666'}
                value={format(time, "EEEE, dd MMM yyyy")}
                size={8}
                weight={600}
            />
            <TextComponent
                color={'#000'}
                value={format(time, "hh:mm a")}
                size={14}
                weight={800}
            />
        </Box>
    );
};

export default memo(LiveClock);
