import React, { memo, useMemo, useState } from "react";
import { Box, Button } from "@mui/joy";
import TextComponent from "../../../components/TextComponent";
import MobileFoodOrder from "./MobileFoodOrder";
import BottomCartPanel from "./BottomCartPanel";
import FoodDetailShowCard from "./FoodDetailShowCard";
import {
    useCustomerPreviousCanteenOrder
} from "../../../CommonData/UseQuery";
import { IoFastFoodOutline } from "react-icons/io5";
import { BsPersonAdd } from "react-icons/bs";
import { PiPersonBold } from "react-icons/pi";


const HEADER_HEIGHT = 40;
const BOTTOM_NAV_HEIGHT = 60;
const PANEL_MARGIN = 20;

const OrderTakingPanel = ({ open, onClose, persontype, fullDetail }) => {

    const [items, setItems] = useState([]);
    const [selectedFood, setSelectedFood] = useState({});

    const { data: PreviousOrders = [], refetch: RefetchPreviousOrder } =
        useCustomerPreviousCanteenOrder(fullDetail?.ip_no, persontype); 


    if (!open) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                top: HEADER_HEIGHT + 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: "95%",
                height: `calc(100vh - ${HEADER_HEIGHT + BOTTOM_NAV_HEIGHT + PANEL_MARGIN}px)`,
                bgcolor: "#fff",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 20px 45px rgba(0,0,0,0.18)",
                border: "1px solid #9d25b8",
                zIndex: 99999,
                boxSizing: 'border-box', animation: "slideUp 0.3s ease"
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #eee"
                }}
            >
                <Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IoFastFoodOutline />
                        <TextComponent value="Take Patient Extra Order" size={14} weight={700} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>

                        <PiPersonBold style={{ fontSize: 12 }} />
                        <TextComponent value={`${fullDetail?.ptc_ptname}`} size={10} weight={700} />
                    </Box>
                </Box>

                <Button
                    size="sm"
                    variant="soft"
                    onClick={onClose}
                    sx={{
                        minHeight: 28,
                        px: 1.5,
                        fontSize: 11,
                        borderRadius: 20,
                        fontWeight: 600,
                    }}
                >
                    Close
                </Button>
            </Box>

            {/* Content */}
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    p: 1,
                    overflowY: 'hidden',
                    height: '100%'
                }}
            >
                <Box sx={{
                    p: 1,
                    height:
                        !selectedFood || Object.keys(selectedFood).length === 0
                            ? "25%"
                            : "45%",
                }}>

                    <MobileFoodOrder
                        setItems={setItems}
                        personType={persontype}
                        setSelectedFood={setSelectedFood}
                        selectedFood={selectedFood}
                        PreviousOrders={PreviousOrders}
                        fullDetail={fullDetail}
                    />

                    <FoodDetailShowCard selectedFood={selectedFood} />

                </Box>

                {/* Cart Section */}
                <BottomCartPanel
                    setItems={setItems}
                    items={items}
                    Orders={PreviousOrders}
                    refetch={RefetchPreviousOrder}
                    fullDetail={fullDetail}
                    personType={persontype}
                    onClose={onClose}
                    selectedFood={selectedFood}
                />
            </Box>
        </Box>
    );
};

export default memo(OrderTakingPanel);