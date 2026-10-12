import { Box } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import React, { memo } from "react";
import { COLORS, FONT, focusRing } from "../Style/designTokens";
import { HEADER_HEIGHT } from "./LoginEmployeeHeader";

const SearchComponent = ({
    onChange,
    value,
    placeholder = "Search",
    selectionMode = false,
    allSelected = false,
    onToggleSelectAll
}) => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: HEADER_HEIGHT,
                left: 0,
                width: "100%",
                boxSizing: "border-box",
                px: 2,
                py: 1,
                bgcolor: COLORS.white,
                borderBottom: `1px solid ${COLORS.line}`,
                zIndex: 1000,
            }}
        >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {selectionMode && (
                    <Box
                        component="button"
                        type="button"
                        onClick={onToggleSelectAll}
                        aria-pressed={allSelected}
                        sx={{
                            flexShrink: 0, height: 44, px: 1.75, borderRadius: "12px", cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 0.5,
                            fontFamily: FONT, fontSize: 15, fontWeight: 700,
                            bgcolor: allSelected ? COLORS.plum : COLORS.wash,
                            color: allSelected ? COLORS.white : COLORS.plum,
                            border: `1.5px solid ${COLORS.plum}`,
                            ...focusRing,
                        }}
                    >
                        <DoneAllRoundedIcon sx={{ fontSize: 20 }} />
                        {allSelected ? "Clear" : "Select all"}
                    </Box>
                )}

                <Box sx={{ position: "relative", flex: 1 }}>
                    <SearchIcon
                        aria-hidden="true"
                        sx={{ position: "absolute", left: 12, top: 12, fontSize: 20, color: COLORS.muted }}
                    />
                    <Box
                        component="input"
                        type="search"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        aria-label={placeholder}
                        autoComplete="off"
                        sx={{
                            boxSizing: "border-box", width: "100%", height: 44, pl: 5, pr: 1.5,
                            fontFamily: FONT, fontSize: 16, color: COLORS.ink,
                            bgcolor: COLORS.surface, border: `1.5px solid ${COLORS.fieldBorder}`,
                            borderRadius: "12px", outline: "none",
                            "&:focus": { borderColor: COLORS.plum, boxShadow: `0 0 0 3px ${COLORS.orchid}` },
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default memo(SearchComponent);
