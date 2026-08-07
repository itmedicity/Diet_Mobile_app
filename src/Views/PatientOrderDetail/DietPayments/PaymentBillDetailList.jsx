import React, { memo } from "react";
import { Box, Divider } from "@mui/joy";
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

const PaymentBillDetailList = ({
    items = [],
    summary = {},
}) => {


    return (
        <Box
            sx={{
                bgcolor: "#f7f7f7",
                border: "1px dashed #636161",
                borderRadius: 2,
                boxShadow: "0 6px 20px rgba(0,0,0,.08)",
                overflow: "hidden",
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
                {items?.map((item, index) => (
                    <Box
                        key={item.id ?? index}
                        sx={{
                            py: 0.5,
                            borderBottom:
                                index !== items.length - 1
                                    ? "1px dashed #ddd"
                                    : "none",

                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box flex={1}>
                            <TextComponent
                                value={item?.name}
                                weight={900}
                                size={10}
                            />

                            <TextComponent
                                value={`Qty ${item?.quantity} × ₹${Number(
                                    item.rate
                                ).toFixed(2)}`}
                                size={10}
                                color="#666"
                                weight={700}
                            />
                        </Box>

                        <TextComponent
                            value={`₹${Number(item.total).toFixed(2)}`}
                            weight={700}
                            size={13}
                        />
                    </Box>
                ))}
            </Box>

            <Box sx={{ p: 2 }}>
                <Row
                    label="Item Total"
                    value={`₹${Number(summary.gross || 0).toFixed(2)}`}
                />

                <Row
                    label="Discount"
                    value={`-₹${Number(summary.discount || 0).toFixed(2)}`}
                    color="#2E7D32"
                />

                <Row
                    label="GST"
                    value={`₹${Number(summary.gst || 0).toFixed(2)}`}
                />

                <Divider />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 0.5,
                    }}
                >
                    <TextComponent
                        value={"Total"}
                        size={14}
                        weight={800}
                        color={"#0f0e0e"}
                    />

                    <TextComponent
                        value={`₹${Number(summary.total || 0).toFixed(2)}`}
                        size={14}
                        weight={800}
                        color={"#0f0e0e"}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default memo(PaymentBillDetailList);