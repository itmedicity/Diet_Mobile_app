import React, { memo, useState } from "react";
import { Box } from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MobileFoodOrder from "./MobileFoodOrder";
import BottomCartPanel from "./BottomCartPanel";
import FoodDetailShowCard from "./FoodDetailShowCard";
import {
    useCustomerPreviousCanteenOrder
} from "../../../CommonData/UseQuery";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

// Extra order for a patient: find a food, add it, review the basket, place the order
const OrderTakingPanel = ({ open, onClose, persontype, fullDetail }) => {

    const [items, setItems] = useState([]);
    const [selectedFood, setSelectedFood] = useState({});

    const { data: PreviousOrders = [], refetch: RefetchPreviousOrder } =
        useCustomerPreviousCanteenOrder(fullDetail?.ip_no, persontype);


    if (!open) return null;

    return (
        <>
            {/* dimmed background; tapping it closes the sheet */}
            <Box
                aria-hidden="true"
                onClick={onClose}
                sx={{ position: "fixed", inset: 0, bgcolor: "rgba(42,16,56,0.45)", zIndex: 1700 }}
            />

            <Box
                role="dialog"
                aria-modal="true"
                aria-label="Extra order"
                sx={{
                    position: "fixed",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    mx: "auto",
                    width: "100%",
                    maxWidth: 560,
                    height: "92dvh",
                    bgcolor: COLORS.white,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 -12px 32px rgba(42,16,56,0.22)",
                    zIndex: 1800,
                    boxSizing: "border-box",
                    overflow: "hidden",
                    fontFamily: FONT,
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        pl: 2.5, pr: 1, py: 1,
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        borderBottom: `1px solid ${COLORS.line}`,
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Box sx={{ fontSize: 18, fontWeight: 700, color: COLORS.ink, lineHeight: 1.25 }}>
                            Extra order
                        </Box>
                        <Box sx={{ fontSize: 14, color: COLORS.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {fullDetail?.ptc_ptname}
                        </Box>
                    </Box>

                    <Box
                        component="button"
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        sx={{
                            flexShrink: 0, width: 48, height: 48, border: 0, borderRadius: "50%", cursor: "pointer",
                            bgcolor: "transparent", color: COLORS.ink, display: "grid", placeItems: "center",
                            "&:active": { bgcolor: COLORS.wash },
                            ...focusRing,
                        }}
                    >
                        <CloseRoundedIcon />
                    </Box>
                </Box>

                {/* Find and choose a food */}
                <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 2.5, py: 2 }}>
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

                {/* Basket and place order */}
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
        </>
    );
};

export default memo(OrderTakingPanel);
