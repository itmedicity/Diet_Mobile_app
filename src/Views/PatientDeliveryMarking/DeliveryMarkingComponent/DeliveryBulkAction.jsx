import React, { memo } from "react";
import { Box, Button } from "@mui/joy";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TextComponent from "../../../components/TextComponent";

const DeliveryBulkAction = ({
    selectedCount = 0,
    buttonText = "Pick Up Orders",
    onAction,
    loading = false,
}) => {

    if (selectedCount === 0) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                width: "92%",
                bgcolor: "rgba(255,255,255,.95)",
                backdropFilter: "blur(12px)",
                borderRadius: "18px",
                border: "1px solid rgba(121,51,234,.12)",
                boxShadow: "0 12px 35px rgba(0,0,0,.18)",
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 2000,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                }}
            >
                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        bgcolor: "#FFF4E5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CheckCircleRoundedIcon
                        sx={{
                            color: "#F59E0B",
                            fontSize: 24,
                        }}
                    />
                </Box>

                <Box>
                    <TextComponent
                        value={`${selectedCount} Item${selectedCount > 1 ? "s" : ""} Selected`}
                        size={14}
                        weight={800}
                    />

                    <TextComponent
                        value="Ready for pickup"
                        size={10}
                        color="#757575"
                    />
                </Box>
            </Box>

            <Button
                loading={loading}
                onClick={onAction}
                startDecorator={<LocalShippingRoundedIcon />}
                sx={{
                    borderRadius: "999px",
                    px: 2.5,
                    py: 1,
                    fontWeight: 700,
                    color: "#fff",
                    background:
                        "linear-gradient(135deg,#FF9800,#F57C00)",
                    boxShadow: "0 6px 16px rgba(245,124,0,.35)",
                    transition: ".25s",
                    "&:hover": {
                        background:
                            "linear-gradient(135deg,#FB8C00,#EF6C00)",
                        transform: "translateY(-1px)",
                    },
                }}
            >
                {buttonText}
            </Button>
        </Box>
    );
};

export default memo(DeliveryBulkAction);