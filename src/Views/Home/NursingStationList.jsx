
import React, { memo } from "react";
import { Box } from "@mui/joy";
import TextComponent from "../../components/TextComponent";
import { useNavigate } from "react-router-dom";

import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const NursingStationList = ({ station = [] }) => {
    const navigate = useNavigate();

    const handleNursingStationClick = (code, name) => {
        navigate("/nsstaion", {
            state: {
                nsCode: code,
                nsName: name,
            },
        });
    };

    return (
        <Box
            sx={{
                width: "95%",
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.5,
                pb: 2,
            }}
        >
            {station?.map((item, index) => (
                <Box
                    key={item?.fb_ns_code || index}
                    onClick={() =>
                        handleNursingStationClick(
                            item?.fb_ns_code,
                            item?.fb_ns_name
                        )
                    }
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: 0,
                        bgcolor: "#fff",
                        border: "1px solid #eee7f0",
                        borderRadius: "13px",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "0.2s ease",

                        "&:hover": {
                            borderColor: "#c58bce",
                            bgcolor: "#fdfaff",
                            boxShadow: "0 4px 12px rgba(80,35,90,0.07)",
                        },

                        "&:active": {
                            transform: "scale(0.985)",
                        },
                    }}
                >
                    {/* Left Accent */}
                    <Box
                        sx={{
                            width: 5,
                            alignSelf: "stretch",
                            bgcolor: "#9b1ea9",
                            flexShrink: 0,
                        }}
                    />

                    {/* Station Icon */}
                    <Box
                        sx={{
                            ml: 1.5,
                            width: 39,
                            height: 39,
                            borderRadius: "11px",
                            bgcolor: "#f7eff9",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                        }}
                    >
                        <ApartmentOutlinedIcon
                            sx={{
                                fontSize: 22,
                                color: "#9b1ea9",
                            }}
                        />
                    </Box>

                    {/* Station Name */}
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            py: 1.6,
                            px: 1.2,
                        }}
                    >
                        <TextComponent
                            value={`STATION ${String(index + 1).padStart(2, "0")}`}
                            size={9}
                            weight={800}
                            color="#a49aa8"
                        />

                        <Box sx={{ mt: 0.3 }}>
                            <TextComponent
                                value={item?.fb_ns_name || "Unnamed Station"}
                                size={16}
                                weight={800}
                                color="#332638"
                                noWrap
                            />
                        </Box>
                    </Box>

                    {/* Arrow */}
                    <Box
                        sx={{
                            mr: 1.3,
                            width: 29,
                            height: 29,
                            borderRadius: "50%",
                            bgcolor: "#f7eff9",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                        }}
                    >
                        <ArrowForwardRoundedIcon
                            sx={{
                                fontSize: 18,
                                color: "#9b1ea9",
                            }}
                        />
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default memo(NursingStationList);
