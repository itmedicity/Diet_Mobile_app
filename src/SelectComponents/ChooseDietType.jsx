import React, { memo, useState } from "react";
import { Box } from "@mui/joy";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";

import { useDietTimes } from "../CommonData/UseQuery";
import TextComponent from "../components/TextComponent";

const ChooseDietType = ({ value, setValue, setName }) => {

    const { data: DietTime = [] } = useDietTimes();

    const [open, setOpen] = useState(false);

    const handleSelect = (item) => {

        setValue(item.type_slno);
        setName(item.type_desc);
        setOpen(false);
    };

    const selectedItem = DietTime?.find(
        (item) => item.type_slno === value
    );

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                mb: 1
            }}
        >

            {/* SELECT BOX */}
            <Box
                onClick={() => setOpen(prev => !prev)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                    px: 1.5,
                    py: 1,

                    borderRadius: "30px",

                    bgcolor: "#fff",

                    border: "1px solid #eee",

                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",

                    cursor: "pointer",

                    transition: "0.2s",

                    "&:hover": {
                        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    }
                }}
            >

                {/* LEFT */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >

                    <Box
                        sx={{
                            width: 30,
                            height: 30,

                            borderRadius: "50%",

                            bgcolor: "#f3e8ff",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <RestaurantMenuRoundedIcon
                            sx={{
                                fontSize: 16,
                                color: "#9d25b8"
                            }}
                        />
                    </Box>

                    <Box>
                        <TextComponent
                            value={
                                selectedItem?.type_desc ||
                                "Choose Meal Type"
                            }
                            size={12}
                            weight={600}
                        />

                        <TextComponent
                            value={
                                selectedItem
                                    ? "Meal selected"
                                    : "Select production batch"
                            }
                            size={10}
                            color="#777"
                        />
                    </Box>
                </Box>

                {/* RIGHT ICON */}
                <KeyboardArrowDownRoundedIcon
                    sx={{
                        color: "#666",
                        transition: "0.2s",
                        transform: open
                            ? "rotate(180deg)"
                            : "rotate(0deg)"
                    }}
                />

            </Box>

            {/* DROPDOWN */}
            {open && (
                <Box
                    sx={{
                        position: "absolute",

                        top: "110%",
                        left: 0,
                        right: 0,

                        bgcolor: "#fff",

                        borderRadius: "20px",

                        border: "1px solid #eee",

                        boxShadow: "0 10px 24px rgba(0,0,0,0.08)",

                        overflow: "hidden",

                        zIndex: 9999
                    }}
                >

                    {DietTime?.map((item) => {

                        const active =
                            value === item.type_slno;

                        return (
                            <Box
                                key={item.type_slno}
                                onClick={() => handleSelect(item)}
                                sx={{
                                    px: 2,
                                    py: 1.2,

                                    cursor: "pointer",

                                    transition: "0.2s",

                                    bgcolor: active
                                        ? "#f3e8ff"
                                        : "#fff",

                                    "&:hover": {
                                        bgcolor: "#f8f1fc"
                                    },

                                    borderBottom:
                                        "1px solid #f5f5f5"
                                }}
                            >

                                <TextComponent
                                    value={item.type_desc}
                                    size={12}
                                    weight={active ? 700 : 500}
                                    color={
                                        active
                                            ? "#9d25b8"
                                            : "#222"
                                    }
                                />

                            </Box>
                        );
                    })}

                </Box>
            )}
        </Box>
    );
};

export default memo(ChooseDietType);