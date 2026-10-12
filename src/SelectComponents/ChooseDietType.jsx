import React, { memo } from "react";
import { Box } from "@mui/joy";
import { useDietTimes } from "../CommonData/UseQuery";
import { COLORS, FONT } from "../Style/designTokens";

// Which meal a bystander's order belongs to (the kitchen batches by it).
// A native select: the phone shows its own picker, which is easier to use than a custom list.
const ChooseDietType = ({ value, setValue, setName }) => {

    const { data: DietTime = [] } = useDietTimes();

    const handleChange = (event) => {
        const item = DietTime?.find((entry) => String(entry.type_slno) === event.target.value);
        setValue(item ? item.type_slno : 0);
        setName(item ? item.type_desc : "");
    };

    return (
        <Box sx={{ fontFamily: FONT }}>
            <Box component="label" htmlFor="meal-type" sx={{ display: "block", mb: 0.75, fontSize: 15, fontWeight: 600, color: COLORS.ink }}>
                Meal type
            </Box>
            <Box
                component="select"
                id="meal-type"
                value={value ? String(value) : ""}
                onChange={handleChange}
                sx={{
                    boxSizing: "border-box", width: "100%", height: 48, px: 1.5,
                    fontFamily: FONT, fontSize: 16, color: COLORS.ink, bgcolor: COLORS.white,
                    border: `1.5px solid ${COLORS.fieldBorder}`, borderRadius: "12px", outline: "none",
                    "&:focus": { borderColor: COLORS.plum, boxShadow: `0 0 0 3px ${COLORS.orchid}` },
                }}
            >
                <option value="">Choose a meal type</option>
                {DietTime?.map((item) => (
                    <option key={item.type_slno} value={String(item.type_slno)}>
                        {item.type_desc}
                    </option>
                ))}
            </Box>
        </Box>
    );
};

export default memo(ChooseDietType);
