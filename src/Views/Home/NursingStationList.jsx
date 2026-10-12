//@The Back End Has Change Means the Verify Token Has been Removed Please Change once Design Completed
import React, { memo } from "react";
import { Box } from "@mui/joy";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useNavigate } from "react-router-dom";
import { COLORS, FONT, focusRing } from "../../Style/designTokens";

const NursingStationList = ({ station = [], searching = false }) => {

    const navigate = useNavigate();

    const handleNursingStationClick = (code, name) => {
        navigate("/nsstaion", {
            state: {
                nsCode: code,
                nsName: name,
            },
        });
    };

    if (!station.length) {
        return (
            <Box sx={{ px: 3, py: 6, fontFamily: FONT, color: COLORS.muted, fontSize: 16, lineHeight: 1.5 }}>
                {searching
                    ? "No nursing station matches your search. Clear the search to see all of them."
                    : "No nursing stations to show yet."}
            </Box>
        );
    }

    return (
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, width: "100%", fontFamily: FONT }}>
            {station.map((item) => (
                <Box component="li" key={item?.fb_ns_code} sx={{ borderBottom: `1px solid ${COLORS.line}` }}>
                    <Box
                        component="button"
                        type="button"
                        onClick={() => handleNursingStationClick(item?.fb_ns_code, item?.fb_ns_name)}
                        sx={{
                            width: "100%", minHeight: 56, px: 2.5, py: 1, border: 0, bgcolor: "transparent",
                            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1,
                            textAlign: "left", cursor: "pointer", fontFamily: FONT,
                            fontSize: 16, fontWeight: 600, color: COLORS.ink,
                            "&:active": { bgcolor: COLORS.wash },
                            ...focusRing,
                        }}
                    >
                        <Box component="span">{item?.fb_ns_name}</Box>
                        <ChevronRightRoundedIcon aria-hidden="true" sx={{ color: COLORS.muted, flexShrink: 0 }} />
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default memo(NursingStationList);
