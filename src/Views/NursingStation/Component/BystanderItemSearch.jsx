import React, { memo } from "react";
import { Box } from "@mui/joy";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { COLORS, FONT } from "../../../Style/designTokens";

const BystanderItemSearch = ({
    value = "",
    onChange
}) => {

    return (
        <Box sx={{ position: "relative", mb: 2 }}>
            <SearchRoundedIcon
                aria-hidden="true"
                sx={{ position: "absolute", left: 12, top: 12, fontSize: 20, color: COLORS.muted }}
            />
            <Box
                component="input"
                type="search"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder="Search food or item code"
                aria-label="Search food or item code"
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
    );
};

export default memo(BystanderItemSearch);
