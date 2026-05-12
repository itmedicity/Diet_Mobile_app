import React, { memo } from "react";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";

const baseStyle = {
    px: 1.5,
    py: 0.5,
    fontSize: 18,
    backgroundColor: "#cfeaff",
    borderRadius: 20,
    cursor: "pointer"
};

const EditToggleButton = ({
    isEditing,
    onEdit,
    onCancel,
    visible = true
}) => {

    if (!visible) return null;

    return isEditing ? (
        <EditOffIcon
            onClick={onCancel}
            sx={{
                ...baseStyle,
                color: "#11083a"
            }}
        />
    ) : (
        <EditIcon
            onClick={onEdit}
            sx={baseStyle}
        />
    );
};

export default memo(EditToggleButton);