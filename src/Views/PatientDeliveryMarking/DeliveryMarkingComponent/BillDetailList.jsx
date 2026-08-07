import React, { memo, useCallback, useEffect, useState } from "react";
import { Box } from "@mui/joy";
import TextComponent from "../../../components/TextComponent";

const Row = ({ label, value, color = "#444", bold = false }) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 0.5,
        }}
    >
        <TextComponent
            value={label}
            size={12}
            weight={bold ? 700 : 500}
            color={color}
        />

        <TextComponent
            value={value}
            size={12}
            weight={bold ? 700 : 600}
            color={color}
        />
    </Box>
);

const BillDetailList = ({
    expand = false,
    items = [],
    summary = {},
    setSelectedItems,
    selectedItems
}) => {

    // Default select all
    useEffect(() => {
        setSelectedItems(items.map((val, index) => val?.id));
    }, [items]);


    const handleToggle = (id) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    return (
        <Box
            sx={{
                maxHeight: expand ? "60vh" : 0,
                overflow: "hidden",
                transition: "all .35s ease",
                opacity: expand ? 1 : 0,
                bgcolor: "#f7f2f9",
                mb: 2,
                boxShadow: "0 -6px 30px rgba(0,0,0,.18)",
                border: "1px dashed #636161",
                mx:1
            }}
        >
            <Box
                sx={{
                    px: 2,
                    pt: 2,
                    overflowY: "auto",
                    maxHeight: "45vh",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                {items?.map((item, index) => {

                    const checked = selectedItems.includes(item?.id);

                    return (
                        <Box
                            key={index}
                            sx={{
                                py: 1.5,
                                borderBottom: "1px dashed #ddd",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            {/* Checkbox */}
                            <Box
                                onClick={() => handleToggle(item.id)}
                                sx={{
                                    cursor: "pointer",
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    bgcolor: checked ? "#7933ea" : "#fff",
                                    border: "2px solid #7933ea",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    flexShrink: 0,
                                    transition: ".2s",
                                }}
                            >
                                {checked && "✓"}
                            </Box>

                            <Box flex={1}>
                                <TextComponent
                                    value={item.name}
                                    weight={600}
                                    size={13}
                                />

                                <TextComponent
                                    value={`Qty ${item.quantity} × ₹${item.rate.toFixed(2)}`}
                                    size={10}
                                    color="#666"
                                />
                            </Box>

                            <TextComponent
                                value={`₹${item.total.toFixed(2)}`}
                                weight={700}
                                size={13}
                            />
                        </Box>
                    );
                })}
            </Box>

            <Box sx={{ p: 2 }}>
                <Row
                    label="Item Total"
                    value={`₹${summary.gross.toFixed(2)}`}
                />

                <Row
                    label="Discount"
                    value={`-₹${summary.discount.toFixed(2)}`}
                    color="#2E7D32"
                />

                <Row
                    label="GST"
                    value={`₹${summary.gst.toFixed(2)}`}
                />
            </Box>
        </Box>
    );
};

export default memo(BillDetailList);