import { Box, Input } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import React, { memo } from "react";

const SearchComponent = ({ onChange, value }) => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 50,
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                py: 1,
                backgroundColor: "white",
                zIndex: 1000,
                // boxShadow: "sm",
                borderTop: '1px solid #f7f7f7'
            }}
        >
            <Input
                size="sm"
                name="Search"
                type="text"
                placeholder="Search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                startDecorator={
                    <SearchIcon sx={{ fontSize: 18, color: "#B126EC" }} />
                }
                sx={{
                    width: "90%",
                    fontFamily: "Bahnschrift",
                    fontSize: "12px",
                    borderRadius: "20px",
                    borderColor: "#B126EC",
                    px: 1.5,
                }}
            />
        </Box>
    );
};

export default memo(SearchComponent);

