//  EmployeeInfo.jsx
import React, { memo } from "react";
import { Box, Avatar } from "@mui/joy";
import TextComponent from "./TextComponent";

const EmployeeInfo = ({
    name = "Rohith Krishna",
    designation = "Diet Coordinator",
    onAvatarClick
}) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
                onClick={onAvatarClick}
                sx={{
                    bgcolor: "#9d25b8",
                    width: 35,
                    height: 35,
                    fontWeight: 600,
                    color: 'white',
                }}
            >
                {name?.charAt(0)}
            </Avatar>

            <Box>
                <TextComponent color={'#000000'} value={name} size={12} weight={800} />
                <TextComponent color={'#a39c9c'} value={designation} size={8} weight={600} />
            </Box>
        </Box>
    );
};

export default memo(EmployeeInfo);





