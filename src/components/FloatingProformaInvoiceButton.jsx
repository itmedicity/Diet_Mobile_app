import React from "react";
import { Box, Tooltip } from "@mui/joy";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import VisibilityIcon from '@mui/icons-material/Visibility';


const FloatingProformaInvoiceButton = ({ onClick }) => {

    return (
        <Tooltip title="View Proforma Invoice" placement="left">
            <Box
                onClick={onClick}
                sx={{
                    position: "fixed",
                    bottom: 160,
                    right: 20,
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background:
                        "linear-gradient(135deg, #6C35DE 0%, #A855F7 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 8px 22px rgba(108, 53, 222, 0.35)",
                    zIndex: 1,
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(255,255,255,0.5)",

                    "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow:
                            "0 12px 28px rgba(108, 53, 222, 0.45)",
                    },

                    "&:active": {
                        transform: "scale(0.95)",
                    },
                }}
            >
                <ReceiptLongRoundedIcon
                    sx={{
                        color: "#fff",
                        fontSize: 27,
                    }}
                />

                {/* Plus Badge */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -2,
                        right: -2,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#22c55e",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #fff",
                    }}
                >
                    <VisibilityIcon sx={{ fontSize: 14 }} />
                </Box>
            </Box>
        </Tooltip>
    );
};

export default FloatingProformaInvoiceButton;