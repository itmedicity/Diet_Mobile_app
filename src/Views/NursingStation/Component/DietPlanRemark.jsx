import React, { useId, useState } from "react";
import { Box } from "@mui/joy";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

// The dietitian's note for this plan: one line when closed, the whole note when opened
const DietPlanRemark = ({ remark = "" }) => {
    const [open, setOpen] = useState(false);
    const panelId = useId();

    if (!remark?.trim()) return null;

    return (
        <Box
            sx={{
                width: "100%", boxSizing: "border-box", mt: 1.5, borderRadius: "16px", overflow: "hidden", fontFamily: FONT,
                bgcolor: COLORS.surface, border: `1px solid ${COLORS.line}`, borderLeft: `4px solid ${COLORS.plum}`,
            }}
        >
            <Box
                component="button"
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-controls={panelId}
                sx={{
                    width: "100%", minHeight: 56, px: 1.5, py: 1, border: 0, bgcolor: "transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 1, textAlign: "left", fontFamily: FONT,
                    ...focusRing,
                }}
            >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ fontSize: 15, fontWeight: 700, color: COLORS.ink }}>Diet plan remark</Box>
                    {!open && (
                        <Box sx={{ mt: 0.25, fontSize: 14, color: COLORS.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {remark}
                        </Box>
                    )}
                </Box>
                <KeyboardArrowDownRounded
                    aria-hidden="true"
                    sx={{ flexShrink: 0, color: COLORS.muted, transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "none" }}
                />
            </Box>

            {open && (
                <Box id={panelId} sx={{ px: 1.5, pb: 1.5, fontSize: 15, lineHeight: 1.6, color: COLORS.ink, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {remark}
                </Box>
            )}
        </Box>
    );
};

export default DietPlanRemark;
