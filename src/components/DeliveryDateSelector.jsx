
import React, { memo, useMemo } from "react";
import { Box } from "@mui/joy";
import { format, addDays } from "date-fns";
import TextComponent from "./TextComponent";

const DeliveryDateSelector = ({ value, onChange, disabled = false }) => {

    const deliveryDates = useMemo(() => [
        {
            label: "Today",
            date: format(new Date(), "yyyy-MM-dd")
        },
        {
            label: "Tomorrow",
            date: format(addDays(new Date(), 1), "yyyy-MM-dd")
        }
    ], []);

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", gap: 0.7, width: "100%" }}>
                {deliveryDates.map((item) => {
                    const isSelected = value === item.date;
                    const date = new Date(`${item.date}T00:00:00`);

                    return (
                        <Box
                            key={item.label}
                            onClick={() => !disabled && onChange(item.date)}
                            sx={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.8,
                                width: "50%",
                                px: 1,
                                py: 0.8,
                                borderRadius: "11px",
                                cursor: disabled ? "default" : "pointer",
                                border: isSelected
                                    ? "1.5px solid #9d25b8"
                                    : "1px solid #eadcf0",
                                background: isSelected
                                    ? "linear-gradient(135deg, #9d25b8, #74158e)"
                                    : "#fff",
                                boxShadow: isSelected
                                    ? "0 3px 9px rgba(157,37,184,0.2)"
                                    : "none",
                                transition: "all 0.2s ease",
                                transform: isSelected ? "translateY(-1px)" : "none",
                                "&:active": {
                                    transform: "scale(0.96)"
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: 27
                                }}
                            >
                                <TextComponent
                                    value={format(date, "EEE").toUpperCase()}
                                    size={8}
                                    weight={700}
                                    color={isSelected ? "#f4dafa" : "#a18ba8"}
                                />
                                <TextComponent
                                    value={format(date, "dd")}
                                    size={17}
                                    weight={800}
                                    color={isSelected ? "#fff" : "#712080"}
                                />
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.2 }}>
                                <TextComponent
                                    value={item.label}
                                    size={10}
                                    weight={700}
                                    color={isSelected ? "#fff" : "#712080"}
                                />
                                <TextComponent
                                    value={format(date, "MMM")}
                                    size={9}
                                    weight={500}
                                    color={isSelected ? "#f4dafa" : "#999"}
                                />
                            </Box>

                            {isSelected && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 4,
                                        right: 4,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 13,
                                        height: 13,
                                        borderRadius: "50%",
                                        bgcolor: "#fff"
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            bgcolor: "#9d25b8"
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default memo(DeliveryDateSelector);
