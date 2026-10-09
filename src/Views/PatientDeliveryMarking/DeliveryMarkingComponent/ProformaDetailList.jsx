import React, { memo } from "react";
import { Box } from "@mui/joy";
import TextComponent from "../../../components/TextComponent";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const Row = ({
    label,
    value,
    color = "#444",
    bold = false,
}) => (
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


const ProformaDetailList = ({
    expand = false,
    items = [],
    setExpand,
    summary = {}
}) => {

    // Calculate total from items if summary.total is not provided
    const total = items?.reduce(
        (sum, item) =>
            sum + Number(item?.amount ?? 0),
        0
    );


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
                mx: 1,
                position: 'relative',
                zIndex:999
            }} >
            <Box
                onClick={() => setExpand(false)}
                sx={{
                    position: 'absolute',
                    width: 100,
                    height: 20,
                    bgcolor: '#a240f1',
                    borderBottomRightRadius: 5,
                    borderBottomLeftRadius: 5,
                    right: 2,
                    boxShadow: 'md',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}>
                <KeyboardDoubleArrowDownIcon sx={{
                    fontSize: 14,
                    color: '#fff'
                }} />

            </Box>
            {/* ITEMS */}
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

                {items?.map((item) => (

                    <Box
                        key={item?.proforma_detail_id}
                        sx={{
                            py: 1.5,

                            borderBottom:
                                "1px dashed #ddd",

                            display: "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            gap: 1,
                        }}
                    >

                        {/* ITEM NAME + QTY */}

                        <Box flex={1}>

                            <TextComponent
                                value={
                                    item?.item_name ||
                                    item?.description ||
                                    "-"
                                }
                                weight={600}
                                size={13}
                            />

                            <TextComponent
                                value={`Qty ${item?.quantity ?? 0} × ₹${Number(
                                    item?.rate ?? 0
                                ).toFixed(2)}`}
                                size={10}
                                color="#666"
                            />

                        </Box>


                        {/* ITEM AMOUNT */}

                        <TextComponent
                            value={`₹${Number(
                                item?.amount ?? 0
                            ).toFixed(2)}`}
                            weight={700}
                            size={13}
                        />

                    </Box>

                ))}

            </Box>


            {/* SUMMARY */}

            <Box sx={{ p: 2 }}>

                <Row
                    label="Item Total"
                    value={`₹${Number(
                        summary?.gross ?? total
                    ).toFixed(2)}`}
                />


                <Row
                    label="Discount"
                    value={`-₹${Number(
                        summary?.discount ?? 0
                    ).toFixed(2)}`}
                    color="#2E7D32"
                />


                <Row
                    label="GST"
                    value={`₹${Number(
                        summary?.gst ?? 0
                    ).toFixed(2)}`}
                />


                <Row
                    label="Total"
                    value={`₹${Number(
                        summary?.total ?? total
                    ).toFixed(2)}`}
                    bold
                />

            </Box>

        </Box>
    );
};


export default memo(ProformaDetailList);