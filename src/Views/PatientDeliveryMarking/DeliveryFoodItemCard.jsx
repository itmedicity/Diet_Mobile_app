import { Box } from "@mui/joy";
import React, { memo, useState, useCallback, useEffect } from "react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { axioslogin } from "../../Axios/axios";
import { EmpauthId, succesNofity, warningNofity } from "../Constant/Constant";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { COLORS, FONT, focusRing } from "../../Style/designTokens";
import { DELIVERY_STATUS } from "../../CommonData/deliveryStatus";

/* STATUS CONFIG: the shared delivery colours, plus two that only items have */
const statusConfig = {
    ...DELIVERY_STATUS,
    PREPARED: { label: "Prepared", color: "#17608F", tint: "#E1F0FA", line: "#9CC7E3" },
    SKIPPED: { label: "Skipped", color: COLORS.muted, tint: COLORS.surface, line: COLORS.line },
};

const DeliveryFoodItemCard = ({ item, patientData, deliveryStatus, dietPlanId,
    BillingDetail
}) => {

    const id = EmpauthId();
    const [expanded, setExpanded] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient()

    const { bill_status } = BillingDetail ?? {};

    const { item_name, description, quantity, patient_diet_id, isBilled, ItemBillStatus } = item ?? {};

    /* TOGGLE SELECT */
    const handleToggle = (st) => {
        setSelectedStatus(prev => (prev === st ? "" : st));
    };

    const allowedStatusFlow = {
        PENDING: ["DELIVERED", "RETURNED", "UNDELIVERED", "CANCELLED"],
        PICKEDUP: ["DELIVERED", "RETURNED", "UNDELIVERED"],
        DELIVERED: [],
        CANCELLED: [],
        RETURNED: [],
        UNDELIVERED: []
    };

    const confirmAction = useCallback(async () => {

        if (selectedStatus === item?.delivery_status) {
            return warningNofity("Status already updated");
        }
        if (!selectedStatus)
            return warningNofity("Select Status Before Updating");


        const payload = {
            // ASSIGNMENT
            assignment_id: patientData?.assignment_id,
            canteen_order_id: patientData?.canteen_order_id,
            item_id: item?.item_id,
            patient_diet_id: patient_diet_id,
            item_name: item.item_name,
            meal: item?.type_desc,
            delivered_qty: item?.quantity,
            type_slno: item?.type_slno,
            source_type: item?.source_type,
            source_id: item?.source_id,
            // STATUS
            delivery_status: selectedStatus,
            // REMARKS
            remarks: remarks || null,
            // UPDATED BY
            updated_by: Number(id),
            // ONLY WHEN DELIVERED
            ...(selectedStatus === "DELIVERED" && {
                develivered_by: Number(id),
                delivered_time: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                delivery_remarks: remarks
            })
        };
        try {

            setLoading(true);
            const response = await axioslogin.post(
                "/dietdelivery/update-delivery-log",
                payload
            );

            const { success, message } =
                response.data ?? {};

            if (success === 0) {
                return warningNofity(message);
            }

            succesNofity(message);
            queryClient.invalidateQueries(['canteenorders', patientData?.canteen_order_id]);
            queryClient.invalidateQueries(['ptextraorder', patientData?.fb_ipad_slno, 'CONFIRMED']);
            queryClient.invalidateQueries(['delivery-status', patientData?.canteen_order_id, patientData?.type_slno]);
            setExpanded(false);
            setSelectedStatus("");
            setRemarks("");
        } catch (err) {
            console.error(err);
            warningNofity("Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [
        selectedStatus,
        remarks,
        item,
        patientData,
        id,
        patient_diet_id,
        queryClient
    ]);

    useEffect(() => {
        setSelectedStatus(item?.delivery_status || "");
    }, [item]);

    const visibleStatuses =
        allowedStatusFlow[item?.delivery_status || "PENDING"] || [];

    const currentStatus =
        statusConfig[item?.delivery_status || "PENDING"] || statusConfig.PENDING;

    // the tag shows the bill state once there is one, otherwise the delivery state
    const tagText = bill_status || ItemBillStatus || currentStatus.label;
    const orderNotPickedUp = deliveryStatus === "PENDING";

    return (
        <Box
            sx={{
                width: "100%", mb: 1.5, borderRadius: "16px", overflow: "hidden", fontFamily: FONT,
                bgcolor: COLORS.white, border: `1.5px solid ${currentStatus.line}`,
            }}
        >
            {/* HEADER */}
            <Box
                component="button"
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded(prev => !prev)}
                sx={{
                    width: "100%", minHeight: 64, p: 1.5, border: 0, textAlign: "left", cursor: "pointer",
                    bgcolor: currentStatus.tint, fontFamily: FONT,
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5,
                    ...focusRing,
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ fontSize: 17, fontWeight: 700, color: COLORS.ink, lineHeight: 1.25 }}>{item_name}</Box>
                    {description && (
                        <Box sx={{ mt: 0.25, fontSize: 14, color: COLORS.muted, lineHeight: 1.35 }}>{description}</Box>
                    )}
                </Box>

                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box sx={{ textAlign: "right" }}>
                        <Box sx={{ fontSize: 15, fontWeight: 700, color: COLORS.ink }}>{`Qty ${quantity}`}</Box>
                        <Box
                            component="span"
                            sx={{
                                display: "inline-block", mt: 0.5, px: 1.25, py: 0.25, borderRadius: "999px",
                                fontSize: 13, fontWeight: 700, bgcolor: COLORS.white,
                                color: isBilled ? COLORS.success : currentStatus.color,
                                border: `1px solid ${isBilled ? "#A9D3B8" : currentStatus.line}`,
                            }}
                        >
                            {tagText}
                        </Box>
                    </Box>
                    <ExpandMoreRoundedIcon
                        aria-hidden="true"
                        sx={{ color: COLORS.muted, transform: expanded ? "rotate(180deg)" : "none" }}
                    />
                </Box>
            </Box>

            {/* EXPANDED */}
            {expanded && visibleStatuses.length > 0 && (
                <Box sx={{ p: 1.5, borderTop: `1px solid ${COLORS.line}` }}>

                    <Box sx={{ mb: 1, fontSize: 15, fontWeight: 600, color: COLORS.ink }}>Mark this item as</Box>

                    {/* TOGGLE STATUS CARDS */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                        {visibleStatuses.map((st) => {
                            const s = statusConfig[st];
                            const isActive = selectedStatus === st;

                            return (
                                <Box
                                    key={st}
                                    component="button"
                                    type="button"
                                    aria-pressed={isActive}
                                    onClick={() => handleToggle(st)}
                                    sx={{
                                        minHeight: 52, px: 1.5, borderRadius: "12px", cursor: "pointer", fontFamily: FONT,
                                        fontSize: 16, fontWeight: 700,
                                        bgcolor: isActive ? s.color : COLORS.white,
                                        color: isActive ? COLORS.white : s.color,
                                        border: `1.5px solid ${isActive ? s.color : s.line}`,
                                        ...focusRing,
                                    }}
                                >
                                    {s.label}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* REMARKS */}
                    <Box component="label" htmlFor={`remarks-${item?.item_id}-${item?.type_slno}`}
                        sx={{ display: "block", mt: 1.5, mb: 0.75, fontSize: 15, fontWeight: 600, color: COLORS.ink }}>
                        Remarks (optional)
                    </Box>
                    <Box
                        component="textarea"
                        id={`remarks-${item?.item_id}-${item?.type_slno}`}
                        rows={2}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        sx={{
                            boxSizing: "border-box", width: "100%", p: 1.5, fontFamily: FONT, fontSize: 16, color: COLORS.ink,
                            bgcolor: COLORS.surface, border: `1.5px solid ${COLORS.fieldBorder}`, borderRadius: "12px",
                            outline: "none", resize: "vertical",
                            "&:focus": { borderColor: COLORS.plum, boxShadow: `0 0 0 3px ${COLORS.orchid}` },
                        }}
                    />

                    {orderNotPickedUp && (
                        <Box sx={{ mt: 1, fontSize: 14, color: COLORS.warning }}>
                            Pick up the order from the kitchen first, then you can set a status.
                        </Box>
                    )}

                    {/* CONFIRM */}
                    <Box
                        component="button"
                        type="button"
                        onClick={confirmAction}
                        disabled={
                            orderNotPickedUp || loading || !selectedStatus ||
                            item?.delivery_status === "DELIVERED" ||
                            item?.delivery_status === "CANCELLED"
                        }
                        sx={{
                            mt: 1.5, width: "100%", height: 52, border: 0, borderRadius: "14px", cursor: "pointer",
                            bgcolor: COLORS.plum, color: COLORS.white, fontFamily: FONT, fontSize: 17, fontWeight: 700,
                            "&:active": { bgcolor: COLORS.plumDark },
                            "&:disabled": { bgcolor: COLORS.orchid, color: COLORS.muted, cursor: "not-allowed" },
                            ...focusRing,
                        }}
                    >
                        {loading ? "Saving…" : item?.delivery_status === "PENDING" ? "Pick up order" : "Apply status"}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default memo(DeliveryFoodItemCard);
