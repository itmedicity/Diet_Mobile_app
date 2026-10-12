import React, { memo, useMemo, useState } from "react";
import { Box } from "@mui/joy";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { EmpauthId, errorNofity, succesNofity, warningNofity } from "../../Constant/Constant";
import { axioslogin } from "../../../Axios/axios";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

const stepButton = (danger) => ({
    width: 44, height: 44, p: 0, border: 0, borderRadius: "12px", cursor: "pointer",
    display: "grid", placeItems: "center",
    bgcolor: danger ? "#FBE9E7" : COLORS.wash,
    color: danger ? COLORS.error : COLORS.plum,
    "&:active": { bgcolor: danger ? "#F5CFC9" : COLORS.orchid },
    ...focusRing,
});

// The basket of the extra order: quantities, remove, total, and "Place order"
const BottomCartPanel = ({ items = [], setItems, refetch, Orders, fullDetail, personType, onClose }) => {

    const id = EmpauthId()

    // blocks double taps on "Place order"
    const [loading, setLoading] = useState(false);

    // gst_amount is stored per line, so it has to follow the quantity (it used to keep the
    // value from the moment the item was added)
    const withQty = (item, qty) => ({
        ...item,
        qty,
        gst_amount: (Number(item.price || 0) * qty * Number(item.gst || 0)) / 100
    });

    /* TOTAL CALCULATION */
    const totalAmount = useMemo(() => {
        return items.reduce((sum, item) => {
            const price = Number(item.price || 0);
            const qty = Number(item.qty || 0);
            const gst = Number(item.gst || 0);

            const gstAmount = (price * qty * gst) / 100;

            return sum + (price * qty) + gstAmount;
        }, 0);
    }, [items]);

    /* HANDLERS */
    const handleIncrement = (id) => {
        setItems(prev =>
            prev.map(i =>
                i.item_id === id ? withQty(i, i.qty + 1) : i
            )
        );
    };

    const handleDecrement = (id) => {
        setItems(prev =>
            prev.map(i =>
                i.item_id === id
                    ? withQty(i, Math.max(1, i.qty - 1))
                    : i
            )
        );
    };

    const handleRemove = (id) => {
        setItems(prev => prev.filter(i => i.item_id !== id));
    };

    const handleConfirmOrder = async () => {

        // ignore extra taps while the order is being placed
        if (loading) return;

        if (!items || items.length === 0) {
            return warningNofity("No items added");
        }


        const existingOrderId = Orders?.find(
            i => i.order_status === "PENDING"
        )?.canteen_order_id;


        try {
            setLoading(true);

            if (existingOrderId) {
                const payload = {
                    itemDetail: items,
                    canteen_order_id: existingOrderId,
                    isExtra: true,
                    patient_id: fullDetail?.dietpt_slno,
                    created_by: id,
                    order_status: 'PENDING'
                };
                const res = await axioslogin.post(
                    "/canteenorder/add/items",
                    payload
                );
                const { success, message } = res.data || {};
                // anything other than success:1 is a failure (was only success === 0)
                if (success !== 1) return warningNofity(message || "Unable to add items to the order");
                succesNofity("Order created successfully");
                refetch()
                setItems([])
                onClose()
                return;
            }

            // CANTEEN ORDER
            const order = {
                admission_id: fullDetail?.ip_no,
                party_type_id: personType,
                nursing_station_id: fullDetail?.fb_nurse_stn_slno,
                room_id: fullDetail?.fb_bed_slno,
                created_by: id,
                status: "PENDING",
                isExtra: true,
                patient_id: fullDetail?.dietpt_slno,
                order_status: 'PENDING'
            };

            const payload = {
                order,
                items
            };

            const res = await axioslogin.post(
                "/canteenorder/create",
                payload
            );

            const { success, message } = res.data || {};

            if (success !== 1) return errorNofity(message || "Unable to create the order");

            succesNofity("Order created successfully");
            refetch();
            setItems([]);
            onClose();

        } catch (err) {
            console.error(err);
            errorNofity(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    if (!items.length) return null;

    return (
        <Box
            sx={{
                flexShrink: 0,
                maxHeight: "50%",
                display: "flex",
                flexDirection: "column",
                borderTop: `1px solid ${COLORS.line}`,
                bgcolor: COLORS.white,
                fontFamily: FONT,
            }}
        >
            <Box sx={{ px: 2.5, pt: 1.5, fontSize: 15, fontWeight: 700, color: COLORS.plum }}>
                {`Basket (${items.length} ${items.length === 1 ? "item" : "items"})`}
            </Box>

            {/* ITEMS */}
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    px: 2.5,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" }
                }}
            >
                {items?.map((item, index) => (
                    <Box
                        key={item.item_id}
                        sx={{
                            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, py: 1,
                            borderTop: index === 0 ? "none" : `1px solid ${COLORS.line}`,
                        }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>{item.item_name}</Box>
                            <Box sx={{ fontSize: 14, color: COLORS.muted }}>{`₹${item.price} × ${item.qty}`}</Box>
                        </Box>

                        {/* CONTROLS */}
                        <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Box component="button" type="button" aria-label={`Fewer ${item.item_name}`}
                                onClick={() => handleDecrement(item.item_id)} sx={stepButton(false)}>
                                <RemoveIcon />
                            </Box>

                            <Box aria-live="polite" sx={{ minWidth: 28, textAlign: "center", fontSize: 18, fontWeight: 700, color: COLORS.ink }}>
                                {item.qty}
                            </Box>

                            <Box component="button" type="button" aria-label={`More ${item.item_name}`}
                                onClick={() => handleIncrement(item.item_id)} sx={stepButton(false)}>
                                <AddIcon />
                            </Box>

                            <Box component="button" type="button" aria-label={`Remove ${item.item_name}`}
                                onClick={() => handleRemove(item.item_id)} sx={{ ...stepButton(true), ml: 0.5 }}>
                                <DeleteOutlineRoundedIcon />
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* TOTAL + ACTION */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    px: 2.5,
                    pt: 1.5,
                    pb: "calc(12px + env(safe-area-inset-bottom))",
                    borderTop: `1px solid ${COLORS.line}`,
                }}
            >
                <Box>
                    <Box sx={{ fontSize: 14, color: COLORS.muted }}>Total with GST</Box>
                    <Box sx={{ fontSize: 24, fontWeight: 700, color: COLORS.ink, lineHeight: 1.1 }}>
                        {`₹${totalAmount.toFixed(2)}`}
                    </Box>
                </Box>

                <Box
                    component="button"
                    type="button"
                    onClick={handleConfirmOrder}
                    disabled={totalAmount === 0 || loading}
                    sx={{
                        flex: 1, maxWidth: 240, height: 52, border: 0, borderRadius: "14px", cursor: "pointer",
                        bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 17, fontWeight: 700,
                        "&:active": { bgcolor: COLORS.plumDark },
                        "&:disabled": { bgcolor: COLORS.orchid, color: COLORS.muted, cursor: "not-allowed" },
                        ...focusRing,
                    }}
                >
                    {loading ? "Placing order…" : "Place order"}
                </Box>
            </Box>

        </Box>
    );
};

export default memo(BottomCartPanel);
