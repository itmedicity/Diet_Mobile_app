import React, { useState } from "react";
import {
    Box,
    Typography,
    IconButton,
} from "@mui/joy";
import {
    StickyNote2Rounded,
    KeyboardArrowDownRounded,
} from "@mui/icons-material";

const DietPlanRemark = ({ remark = "" }) => {
    const [open, setOpen] = useState(false);

    if (!remark?.trim()) return null;

    return (
        <Box
            sx={{
                width: "93%",
                borderRadius: 5,
                backgroundColor: "background.surface",
                border: "1px solid",
                borderColor: "neutral.200",
                overflow: "hidden",
                borderLeft: "2px solid #9d25b8",
                borderRight: '2px solid #9d25b8',
            }}
        >
            {/* Top Section */}
            <Box
                onClick={() => setOpen((prev) => !prev)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1.5,
                    py: 1.4,
                    cursor: "pointer",
                    userSelect: "none",
                }}
            >
                {/* Note Icon */}
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        minWidth: 44,
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            "linear-gradient(135deg, var(--joy-palette-primary-softBg), var(--joy-palette-primary-100))",
                    }}
                >
                    <StickyNote2Rounded
                        sx={{
                            fontSize: 23,
                            color: "#9d25b8",

                        }}
                    />
                </Box>

                {/* Text */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize:12
                            }}
                        >
                            Diet Plan Remark
                        </Typography>
                    </Box>

                    <Typography
                        level="body-xs"
                        sx={{
                            mt: 0.35,
                            color: "text.tertiary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize:10
                        }}
                    >
                        {open
                            ? "Additional information about this plan"
                            : remark}
                    </Typography>
                </Box>

                {/* Arrow */}
                <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        backgroundColor: "neutral.softBg",
                    }}
                >
                    <KeyboardArrowDownRounded
                        sx={{
                            fontSize: 22,
                            transition: "transform 0.25s ease",
                            transform: open
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                        }}
                    />
                </IconButton>
            </Box>

            {/* Expanded Content */}
            {open && (
                <Box
                    sx={{
                        px: 1.5,
                        pb: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1.25,
                            p: 1.5,
                            borderRadius: "16px",
                            backgroundColor: "neutral.50",
                        }}
                    >
                        {/* Accent */}
                        <Box
                            sx={{
                                width: 3,
                                minWidth: 3,
                                borderRadius: "999px",
                                backgroundColor: "primary.400",
                            }}
                        />

                        {/* Remark */}
                        <Typography
                            level="body-sm"
                            sx={{
                                lineHeight: 1.7,
                                color: "text.primary",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                fontSize:12
                            }}
                        >
                            {remark}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default DietPlanRemark;