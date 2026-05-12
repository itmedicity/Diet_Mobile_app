import React from "react";
import { Box } from "@mui/joy";
import InboxIcon from "@mui/icons-material/Inbox";
import TextComponent from "../../../components/TextComponent";

const EmptyOrders = ({ message = "No orders found", subMessage = "No orders available for the selected status" }) => {
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                color: "#888",
                px: 2
            }}
        >
            <Box
                sx={{
                    bgcolor: "#f1f3f6",
                    borderRadius: "50%",
                    p: 2,
                    mb: 2
                }}
            >
                <InboxIcon sx={{ fontSize: 40, color: "#b0b0b0" }} />
            </Box>

            <TextComponent
                value={message}
                size={14}
                weight={700}
                color="#333"
            />

            <TextComponent
                value={subMessage}
                size={11}
                color="#777"
            />
        </Box>
    );
};

export default EmptyOrders;