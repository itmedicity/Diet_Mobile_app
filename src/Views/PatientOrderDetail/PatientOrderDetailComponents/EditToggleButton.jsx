import React, { memo } from "react";
import { Box } from "@mui/joy";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

// "Edit" opens quantity editing on a pending order; "Done" leaves it without saving
const EditToggleButton = ({
    isEditing,
    onEdit,
    onCancel,
    visible = true
}) => {

    if (!visible) return null;

    return (
        <Box
            component="button"
            type="button"
            onClick={isEditing ? onCancel : onEdit}
            sx={{
                height: 40, px: 1.5, borderRadius: "10px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 0.5,
                border: `1.5px solid ${COLORS.plum}`, bgcolor: isEditing ? COLORS.plum : COLORS.white,
                color: isEditing ? COLORS.white : COLORS.plum,
                fontFamily: FONT, fontSize: 15, fontWeight: 700,
                ...focusRing,
            }}
        >
            {!isEditing && <EditRoundedIcon sx={{ fontSize: 18 }} />}
            {isEditing ? "Stop editing" : "Edit"}
        </Box>
    );
};

export default memo(EditToggleButton);
