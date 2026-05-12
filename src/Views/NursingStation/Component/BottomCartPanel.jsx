import React, { memo, useMemo } from "react";
import { Box, Button } from "@mui/joy";
import TextComponent from "../../../components/TextComponent";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { EmpauthId, errorNofity, succesNofity, warningNofity } from "../../Constant/Constant";
import { axioslogin } from "../../../Axios/axios";

const BottomCartPanel = ({ items = [], setItems, refetch, Orders, fullDetail, personType, onClose, selectedFood }) => {

    const id = EmpauthId()


    console.log({ selectedFood,items });


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
                i.item_id === id ? { ...i, qty: i.qty + 1 } : i
            )
        );
    };

    const handleDecrement = (id) => {
        setItems(prev =>
            prev.map(i =>
                i.item_id === id
                    ? { ...i, qty: Math.max(1, i.qty - 1) }
                    : i
            )
        );
    };

    const handleRemove = (id) => {
        setItems(prev => prev.filter(i => i.item_id !== id));
    };

    const handleConfirmOrder = async () => {

        if (!items || items.length === 0) {
            return warningNofity("No items added");
        }


        const existingOrderId = Orders?.find(
            i => i.order_status === "PENDING"
        )?.canteen_order_id;


        try {
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
                if (success === 0) return warningNofity(message);
                succesNofity("Order created successfully");
                refetch()
                setItems()
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

            if (success !== 1) return errorNofity(message);

            succesNofity("Order created successfully");
            refetch();
            setItems();
            onClose();

        } catch (err) {
            console.error(err);
            errorNofity("Something went wrong");
        }
    }

    if (!items.length) return null;

    return (
        <Box
            sx={{
                mt: "auto",   // pushes it to bottom
                bgcolor: "#fff",
                borderTop: "1px solid #eee",
                p: 1.5,
                boxShadow: "0 -5px 20px rgba(0,0,0,0.08)",
                borderRadius: 12,

                /* KEY PART */
                maxHeight: !selectedFood || Object.keys(selectedFood).length === 0
                    ? '75%' : "50%",
                display: "flex",
                flexDirection: "column"
            }}
        >

            {/* ITEMS */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    mb: 1,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" }
                }}
            >
                {items?.map(item => (
                    <Box
                        key={item.item_id}
                        sx={{
                            width: '100%',
                            boxShadow: 'sm',
                            borderRadius: 5,
                            bgcolor: '#fff',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1,
                            border: '1px solid #e282e5',
                            boxSizing: "border-box",
                        }}
                    >
                        <Box sx={{ maxWidth: "50%" }}>
                            <TextComponent
                                value={item.item_name}
                                size={13}
                                weight={600}
                            />
                            <TextComponent
                                value={`₹${item.price} × ${item.qty}`}
                                size={11}
                                color="#777"
                            />
                        </Box>

                        {/* CONTROLS */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Button size="sm" variant="soft" onClick={() => handleDecrement(item.item_id)}>
                                -
                            </Button>

                            <TextComponent
                                value={item.qty}
                                size={13}
                                sx={{ minWidth: 20, textAlign: "center" }}
                            />

                            <Button size="sm" variant="soft" onClick={() => handleIncrement(item.item_id)}>
                                +
                            </Button>

                            {/* REMOVE */}
                            <Button
                                size="sm"
                                variant="plain"
                                color="danger"
                                onClick={() => handleRemove(item.item_id)}
                            >
                                ✕
                            </Button>
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
                    borderTop: "1px dashed #ddd",
                    pt: 1
                }}
            >
                <TextComponent
                    value={`₹ ${totalAmount.toFixed(2)}`}
                    size={14}
                    weight={700}
                />
                <Button
                    onClick={handleConfirmOrder}
                    size="sm"
                    startDecorator={
                        <ConfirmationNumberIcon sx={{ fontSize: 16 }} />
                    }
                    disabled={totalAmount === 0}
                    sx={{
                        px: 2,
                        height: 34,
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        bgcolor: "#9d25b8",
                        "&:hover": { bgcolor: "#7b1fa2" },
                    }}
                >
                    Confirm Order
                </Button>

            </Box>

        </Box>
    );
};

export default memo(BottomCartPanel);