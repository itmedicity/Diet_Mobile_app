import React, { memo, useMemo, useState } from "react";
import { Box } from "@mui/joy";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

const actionButton = (kind, disabled) => ({
    flex: kind === "save" ? "1 1 100%" : 1, minHeight: 48, px: 1, borderRadius: "12px", cursor: disabled ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5,
    fontFamily: FONT, fontSize: 15, fontWeight: 700, whiteSpace: "nowrap",
    bgcolor: kind === "primary" ? COLORS.plum : kind === "save" ? COLORS.success : COLORS.wash,
    color: kind === "ghost" ? COLORS.plum : COLORS.white,
    border: kind === "ghost" ? `1.5px solid ${COLORS.plum}` : 0,
    opacity: disabled ? 0.6 : 1,
    ...focusRing,
});

// Top of the packing panel: pack the order into packets, or (once packed) see and print the packets
const PackingActionBar = ({
    itemCount = 0,

    // Existing packing data from API
    PackageDetails = [],

    // New packing state
    packetCount = 0,
    saving = false,

    // On Individual Packet Click
    setPacketIds,

    onAddPacket,
    onAutoPack,
    onSubmit,

    onPrint
}) => {

    // which saved packet is open (the list below shows only that one)
    const [openUid, setOpenUid] = useState(null);

    /* GROUP EXISTING PACKING BY PACKET UID */
    const existingPackets = useMemo(() => {

        if (!Array.isArray(PackageDetails)) {
            return [];
        }
        return PackageDetails.reduce((acc, detail) => {
            const packetUid = detail?.packet_uid;
            if (!packetUid) {
                return acc;
            }
            const existingPacket = acc.find(
                packet =>
                    packet.packet_uid === packetUid
            );
            if (existingPacket) {
                existingPacket.items = [
                    ...existingPacket.items,
                    detail
                ];
                return acc;
            }
            return [
                ...acc,
                {
                    packing_id: detail?.packing_id,
                    packet_uid: packetUid,
                    packet_no: Number(
                        detail?.packet_no ?? 0
                    ),
                    items: [detail]
                }
            ];
        }, []);

    }, [PackageDetails]);

    const hasExistingPacking = existingPackets.length > 0;

    const displayPacketCount = hasExistingPacking
        ? existingPackets.length
        : packetCount;

    const togglePacket = (uid) => {
        setOpenUid(prev => (prev === uid ? null : uid));
        setPacketIds(prev => (prev === uid ? null : uid));
    };

    return (
        <Box
            sx={{
                p: 1.5, borderRadius: "14px", fontFamily: FONT,
                bgcolor: hasExistingPacking ? "#E3F3E8" : COLORS.wash,
                border: `1px solid ${hasExistingPacking ? "#A9D3B8" : COLORS.orchid}`,
            }}
        >

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {hasExistingPacking
                    ? <CheckCircleRoundedIcon aria-hidden="true" sx={{ color: COLORS.success }} />
                    : <Inventory2RoundedIcon aria-hidden="true" sx={{ color: COLORS.plum }} />}

                <Box sx={{ flex: 1 }}>
                    <Box sx={{ fontSize: 17, fontWeight: 700, color: hasExistingPacking ? COLORS.success : COLORS.ink }}>
                        {hasExistingPacking ? "Order packed" : "Pack this order"}
                    </Box>
                    <Box sx={{ fontSize: 14, color: COLORS.muted }}>
                        {`${itemCount} ${itemCount === 1 ? "item" : "items"}  ·  ${displayPacketCount} ${displayPacketCount === 1 ? "packet" : "packets"}`}
                    </Box>
                </Box>

                {hasExistingPacking && (
                    <Box
                        component="button"
                        type="button"
                        aria-label="Print packet labels"
                        onClick={() => onPrint(existingPackets)}
                        sx={{
                            width: 48, height: 48, border: 0, borderRadius: "50%", cursor: "pointer",
                            display: "grid", placeItems: "center", bgcolor: COLORS.white, color: COLORS.plum, ...focusRing,
                        }}
                    >
                        <LocalPrintshopIcon />
                    </Box>
                )}
            </Box>

            {hasExistingPacking ? (

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.25 }}>
                    {existingPackets.map(packet => {
                        const open = openUid === packet.packet_uid;
                        return (
                            <Box
                                key={packet.packet_uid}
                                component="button"
                                type="button"
                                aria-pressed={open}
                                onClick={() => togglePacket(packet.packet_uid)}
                                sx={{
                                    minHeight: 48, px: 1.5, borderRadius: "12px", cursor: "pointer", textAlign: "left", fontFamily: FONT,
                                    bgcolor: open ? COLORS.success : COLORS.white,
                                    color: open ? COLORS.white : COLORS.success,
                                    border: `1.5px solid ${COLORS.success}`, ...focusRing,
                                }}
                            >
                                <Box sx={{ fontSize: 15, fontWeight: 700 }}>{packet.packet_uid}</Box>
                                <Box sx={{ fontSize: 13 }}>{`${packet.items.length} ${packet.items.length === 1 ? "item" : "items"}`}</Box>
                            </Box>
                        );
                    })}
                </Box>

            ) : (

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.25 }}>
                    <Box component="button" type="button" onClick={saving ? undefined : onAddPacket} disabled={saving} sx={actionButton("primary", saving)}>
                        <AddRoundedIcon aria-hidden="true" />
                        New packet
                    </Box>

                    <Box component="button" type="button" onClick={saving ? undefined : onAutoPack} disabled={saving} sx={actionButton("ghost", saving)}>
                        <LocalShippingIcon aria-hidden="true" />
                        Auto pack
                    </Box>

                    <Box component="button" type="button" onClick={saving ? undefined : onSubmit} disabled={saving} sx={actionButton("save", saving)}>
                        <SaveIcon aria-hidden="true" />
                        {saving ? "Saving…" : "Save"}
                    </Box>
                </Box>

            )}

        </Box>
    );
};

export default memo(PackingActionBar);
