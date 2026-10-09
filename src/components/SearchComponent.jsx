import { Box, Input, IconButton } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import React, { memo } from "react";

const SearchComponent = ({
    onChange,
    value,
    selectionMode = false,
    allSelected = false,
    onToggleSelectAll
}) => {
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
                bgcolor: "#fff",
                zIndex: 1000,
                borderTop: "1px solid #f7f7f7"
            }}
        >
            <Box
                sx={{
                    width: "92%",
                    display: "flex",
                    gap: 1,
                    alignItems: "center"
                }}
            >
                {selectionMode && (
                    <IconButton
                        size="sm"
                        onClick={onToggleSelectAll}
                        sx={{
                            borderRadius: "20px",
                            px: 2,
                            minWidth: 95,
                            bgcolor: allSelected ? "#7B1FA2" : "#F3E5F5",
                            color: allSelected ? "#fff" : "#7B1FA2",
                            border: "1px solid #CE93D8",
                            fontWeight: 700,
                            "&:hover": {
                                bgcolor: allSelected
                                    ? "#6A1B9A"
                                    : "#E1BEE7"
                            }
                        }}
                    >
                        <DoneAllRoundedIcon sx={{ mr: .5 }} />
                        {allSelected ? "Clear" : "All"}
                    </IconButton>
                )}
                <Input
                    size="sm"
                    placeholder="Search"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    startDecorator={
                        <SearchIcon
                            sx={{
                                fontSize: 18,
                                color: "#B126EC"
                            }}
                        />
                    }
                    sx={{
                        flex: 1,
                        fontFamily: "Bahnschrift",
                        fontSize: 12,
                        borderRadius: "20px",
                        borderColor: "#B126EC",
                        px: 1.5
                    }}
                />


            </Box>
        </Box>
    );
};

export default memo(SearchComponent);