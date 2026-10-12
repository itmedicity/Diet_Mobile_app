import React, {
    memo,
    useMemo,
    useState,
    useCallback
} from "react";

import { Box } from "@mui/joy";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import PackedPacketItemList from "./PackedPacketItemList";

import {
    EmpauthId,
    infoNofity,
    succesNofity
} from "../../Constant/Constant";
import { axioslogin } from "../../../Axios/axios";
import { existingPackets } from "../../Constant/Common";
import PackingActionBar from "./PackingActionBar";
import { COLORS, FONT, focusRing } from "../../../Style/designTokens";

const InstantOrderItemList = ({
    items = [],
    orderId,
    AssignmentId,
    PackageDetails,
    setExpandedOrderId,
    onPacketsChange,
    TypeSlno,
    handlePrintDetails
}) => {

    const id = EmpauthId()
    /* 
       PACKET STATE
     */

    const [packets, setPackets] = useState([]);

    const [activePacketId, setActivePacketId] = useState(null);

    const [selectedItems, setSelectedItems] = useState([]);

    const [saving, setSaving] = useState(false);

    const [packetIds, setPacketIds] = useState([]);

    const groupedPackageDetails = existingPackets(
        PackageDetails,
        items
    );

    const displayPackets = groupedPackageDetails.length > 0
        ? packetIds ?
            groupedPackageDetails.filter(packet => packet?.packet_uid === packetIds) : []
        : packets;

    /* 
    PACKET COUNT
    */

    const packetCount = displayPackets.length;

    /* 
       TOTAL AMOUNT
     */

    const totalAmount = useMemo(() => {

        return items.reduce((sum, item) => {

            const quantity =
                Number(item?.quantity ?? 0);

            const price =
                Number(item?.price ?? 0);

            const gstAmount =
                Number(item?.gst_amount ?? 0);

            return sum +
                ((price + gstAmount) * quantity);

        }, 0);

    }, [items]);




    /* 
       ASSIGNED ITEM IDS
       
       Only confirmed packet items are considered packed.
     */

    const assignedItemIds = useMemo(() => {
        return new Set([
            ...groupedPackageDetails.flatMap(packet =>
                packet.items?.map(item =>
                    item?.canteen_order_item_id ??
                    item?.order_detail_id ??
                    item?.item_id
                ) || []
            ),

            ...packets
                .filter(packet => packet.confirmed)
                .flatMap(packet =>
                    packet.items?.map(item =>
                        item?.canteen_order_item_id ??
                        item?.order_detail_id ??
                        item?.item_id
                    ) || []
                )
        ]);
    }, [groupedPackageDetails, packets]);


    const assignedItemCount =
        assignedItemIds.size;


    /* 
       CREATE NEW PACKET
     */

    const handleCreatePacket = useCallback(() => {

        /*
         * If another packet is currently active,
         * make sure it contains at least one item.
         */

        if (activePacketId) {

            const activePacket =
                packets.find(
                    packet =>
                        packet.temp_id === activePacketId
                );

            if (
                !activePacket?.items ||
                activePacket.items.length === 0
            ) {

                return infoNofity(
                    "Please add at least one item to the current packet!"
                );

            }

        }


        /*
         * Check whether all items are already packed.
         */

        if (
            assignedItemCount ===
            Number(items?.length)
        ) {

            return infoNofity(
                "No Items For a New Packet!"
            );

        }


        /*
         * One packet cannot be created for more
         * item rows than available.
         */

        if (
            packetCount >=
            Number(items?.length)
        ) {

            return infoNofity(
                "Packet Count Exceed Item Count"
            );

        }


        const packet = {

            temp_id:
                `TEMP-${Date.now()}`,

            packet_no:
                packets.length + 1,

            confirmed: false,

            items: []

        };


        setPackets(prev => [

            ...prev,

            packet

        ]);


        setActivePacketId(
            packet.temp_id
        );

        setSelectedItems([]);


    }, [
        packets,
        activePacketId,
        assignedItemCount,
        items,
        packetCount
    ]);


    /* 
       SELECT PACKET
     */

    const handleSelectPacket = useCallback(
        (packet) => {

            /*
             * Confirmed packets cannot be edited.
             */

            if (packet.confirmed) {
                return;
            }


            setActivePacketId(
                packet.temp_id
            );


            setSelectedItems(
                packet.items || []
            );

        },
        []
    );


    /* 
       GET ITEM ID
     */

    const getItemId = useCallback((item) => {
        return (
            item?.canteen_order_item_id ??
            item?.order_detail_id ??
            item?.item_id
        );

    }, []);


    /* 
       ITEM CHECKBOX TOGGLE
     */

    const handleItemToggle = useCallback(
        (item) => {

            if (!activePacketId) {
                return;
            }


            const itemId =
                getItemId(item);


            setSelectedItems(prev => {

                const exists =
                    prev.some(
                        selected =>
                            getItemId(selected) ===
                            itemId
                    );


                /*
                 * Remove item if already selected.
                 */

                if (exists) {

                    return prev.filter(
                        selected =>
                            getItemId(selected) !==
                            itemId
                    );

                }


                /*
                 * Add item.
                 */

                return [
                    ...prev,
                    item
                ];

            });

        },
        [
            activePacketId,
            getItemId
        ]
    );


    /* 
       CHECK WHETHER ITEM IS SELECTED
     */

    const isItemSelected = useCallback(
        (item) => {

            const itemId =
                getItemId(item);


            return selectedItems.some(
                selected =>
                    getItemId(selected) ===
                    itemId
            );

        },
        [
            selectedItems,
            getItemId
        ]
    );


    /* 
       CONFIRM PACKET
     */

    const handleConfirmPacket = useCallback(
        (packetId) => {

            if (
                !selectedItems.length
            ) {

                return infoNofity(
                    "Please select at least one item!"
                );

            }


            const updatedPackets =
                packets.map(packet => {

                    if (
                        packet.temp_id !==
                        packetId
                    ) {

                        return packet;

                    }


                    return {

                        ...packet,

                        items:
                            selectedItems,

                        confirmed:
                            true

                    };

                });


            setPackets(
                updatedPackets
            );


            setActivePacketId(null);

            setSelectedItems([]);


            onPacketsChange?.(
                updatedPackets
            );

        },
        [
            packets,
            selectedItems,
            onPacketsChange
        ]
    );


    /* 
       CANCEL PACKET
     */

    const handleCancelPacket =
        useCallback(
            (packetId) => {

                const updatedPackets =
                    packets
                        .filter(
                            packet =>
                                packet.temp_id !==
                                packetId
                        )
                        .map(
                            (packet, index) => ({

                                ...packet,

                                packet_no:
                                    index + 1

                            })
                        );


                setPackets(
                    updatedPackets
                );


                setActivePacketId(null);

                setSelectedItems([]);


                onPacketsChange?.(
                    updatedPackets
                );

            },
            [
                packets,
                onPacketsChange
            ]
        );


    /* 
       REMOVE ITEM FROM PACKET
     */

    const handleRemoveItemFromPacket =
        useCallback(
            (
                packetId,
                itemToRemove
            ) => {

                const removeId =
                    getItemId(
                        itemToRemove
                    );


                const updatedPackets =
                    packets

                        .map(packet => {

                            if (
                                packet.temp_id !==
                                packetId
                            ) {

                                return packet;

                            }


                            const remainingItems =
                                packet.items?.filter(
                                    item =>
                                        getItemId(item) !==
                                        removeId
                                ) || [];


                            return {

                                ...packet,

                                items:
                                    remainingItems

                            };

                        })

                        /*
                         * If packet becomes empty,
                         * remove the packet completely.
                         */

                        .filter(
                            packet =>
                                packet.items?.length > 0
                        )

                        /*
                         * Re-number packets.
                         */

                        .map(
                            (packet, index) => ({

                                ...packet,

                                packet_no:
                                    index + 1

                            })
                        );


                /*
                 * Check whether removed packet
                 * still exists.
                 */

                const packetStillExists =
                    updatedPackets.some(
                        packet =>
                            packet.temp_id ===
                            packetId
                    );


                if (
                    !packetStillExists
                ) {

                    setActivePacketId(
                        null
                    );

                    setSelectedItems([]);

                }


                setPackets(
                    updatedPackets
                );


                onPacketsChange?.(
                    updatedPackets
                );

            },
            [
                packets,
                getItemId,
                onPacketsChange
            ]
        );


    /* 
       AUTO PACK
       
       Creates one packet for every remaining item.
     */

    const handleAutoPack =
        useCallback(
            () => {

                /*
                 * Get only items which are
                 * not already packed.
                 */

                const remainingItems =
                    items.filter(
                        foodItem => {

                            const itemId =
                                getItemId(
                                    foodItem
                                );


                            return !assignedItemIds.has(
                                itemId
                            );

                        }
                    );


                /*
                 * Nothing remaining.
                 */

                if (
                    !remainingItems.length
                ) {

                    return infoNofity(
                        "All items are already packed!"
                    );

                }


                /*
                 * Don't auto-pack while
                 * an empty packet is active.
                 */

                if (activePacketId) {

                    const activePacket =
                        packets.find(
                            packet =>
                                packet.temp_id ===
                                activePacketId
                        );


                    if (
                        !activePacket?.items?.length
                    ) {

                        return infoNofity(
                            "Please add an item to the current packet first!"
                        );

                    }

                }


                const startingPacketNo =
                    packets.length + 1;


                /*
                 * Create one packet
                 * for each remaining item.
                 */

                const newPackets =
                    remainingItems.map(
                        (
                            foodItem,
                            index
                        ) => ({

                            temp_id:
                                `TEMP-${Date.now()}-${index}`,

                            packet_no:
                                startingPacketNo +
                                index,

                            confirmed:
                                true,

                            items: [
                                foodItem
                            ]

                        })
                    );


                const updatedPackets = [

                    ...packets,

                    ...newPackets

                ];


                setPackets(
                    updatedPackets
                );


                setActivePacketId(
                    null
                );

                setSelectedItems([]);


                onPacketsChange?.(
                    updatedPackets
                );

            },
            [
                items,
                getItemId,
                assignedItemIds,
                activePacketId,
                packets,
                onPacketsChange
            ]
        );



    /* 
       SUBMIT PACKING
     */

    const handleSubmitPacking =
        useCallback(
            async () => {

                /*
                 * Prevent double click.
                 */

                if (saving) { return; }


                /*
                 * Validate items.
                 */

                if (!items?.length) {
                    return infoNofity("No items available for packing!");
                }


                /*
                 * Validate packets.
                 */

                if (!packets?.length) {
                    return infoNofity("Please create at least one packet!");
                }


                /*
                 * Check unconfirmed packets.
                 */

                const hasUnconfirmedPacket =
                    packets.some(
                        packet =>
                            !packet.confirmed
                    );


                if (
                    hasUnconfirmedPacket
                ) {

                    return infoNofity(
                        "Please confirm all packets before submitting!"
                    );

                }


                /*
                 * Check whether all order
                 * items are packed.
                 */

                if (
                    assignedItemIds.size !==
                    items.length
                ) {

                    return infoNofity(
                        "Please pack all items before submitting!"
                    );

                }


                /*
                 * Validate order ID.
                 */

                if (!orderId) {

                    return infoNofity(
                        "Order ID is missing!"
                    );

                }


                /*
                 * Prepare API payload.
                 */

                const payload = {
                    order_id:
                        orderId,
                    created_by:
                        id || null,
                    packet_count:
                        packetCount,
                    assignment_detail_id:
                        AssignmentId,
                    type_slno:
                        TypeSlno,
                    packets:
                        packets?.map(
                            packet => ({
                                packet_no:
                                    packet.packet_no,
                                items:
                                    packet.items.map(
                                        item => ({
                                            order_item_id:
                                                getItemId(
                                                    item
                                                ),
                                            quantity:
                                                Number(
                                                    item?.quantity ?? 0
                                                )
                                        }))
                            }))
                };
                /*
                 * Check invalid item IDs.
                 */

                const hasInvalidItem =
                    payload?.packets?.some(
                        packet =>
                            packet?.items.some(
                                item =>
                                    !item.order_item_id
                            )
                    );


                if (
                    hasInvalidItem
                ) {

                    return infoNofity(
                        "Invalid order item found!"
                    );

                }


                try {

                    setSaving(true);

                    const response = await axioslogin.post('/dietdelivery/package/insert', payload);

                    const { success, message } = response?.data;

                    if (
                        success === 1
                    ) {

                        succesNofity(
                            "Order packed successfully!"
                        );


                        /*
                         * Clear local packing state.
                         */

                        setPackets([]);

                        setActivePacketId(
                            null
                        );

                        setSelectedItems([]);
                        onPacketsChange?.(
                            []
                        );

                    } else {

                        infoNofity(
                            message ||
                            "Failed to save packing!"
                        );

                    }

                } catch (error) {

                    console.error(
                        "Packing save error:",
                        error
                    );


                    infoNofity(
                        error?.response?.data?.message ||
                        "Something went wrong while saving packing!"
                    );

                } finally {

                    setSaving(false);
                    setExpandedOrderId(null)

                }

            },
            [
                saving,
                items,
                packets,
                assignedItemIds,
                orderId,
                id,
                getItemId,
                onPacketsChange,
                AssignmentId,
                TypeSlno,
                packetCount,
                setExpandedOrderId
            ]
        );

    /*
       RENDER
     */

    const unpackedItems = items?.filter(foodItem => !assignedItemIds.has(getItemId(foodItem))) ?? [];

    const iconButton = (bg, color, disabled) => ({
        flexShrink: 0, width: 48, height: 48, border: 0, borderRadius: "50%", cursor: disabled ? "not-allowed" : "pointer",
        display: "grid", placeItems: "center", bgcolor: bg, color, opacity: disabled ? 0.5 : 1, ...focusRing,
    });

    return (

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, fontFamily: FONT }}>

            <PackingActionBar
                itemCount={items.length}
                packetCount={packetCount}
                PackageDetails={PackageDetails}
                saving={saving}

                setPacketIds={setPacketIds}
                onAddPacket={handleCreatePacket}
                onAutoPack={handleAutoPack}
                onSubmit={handleSubmitPacking}

                onPrint={handlePrintDetails}
            />

            {/* PACKETS */}
            {displayPackets.length > 0 && (

                <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1 }}>

                    {displayPackets.map(packet => {

                        const isActive =
                            activePacketId ===
                            (packet.temp_id || packet.packet_uid);

                        const itemCount = packet.items?.length ?? 0;

                        return (
                            <Box
                                component="li"
                                key={packet.packet_uid || packet.temp_id}
                                sx={{
                                    borderRadius: "14px", overflow: "hidden",
                                    border: `${isActive ? 2 : 1}px solid ${isActive ? COLORS.plum : packet.confirmed ? "#A9D3B8" : COLORS.line}`,
                                    bgcolor: packet.confirmed ? "#F4FBF6" : COLORS.white,
                                }}
                            >

                                {/* PACKET HEADER: tap to choose items for it */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, pr: 1 }}>
                                    <Box
                                        component="button"
                                        type="button"
                                        disabled={!!packet.confirmed}
                                        onClick={() => handleSelectPacket(packet)}
                                        sx={{
                                            flex: 1, minHeight: 60, px: 1.5, border: 0, bgcolor: "transparent", textAlign: "left",
                                            display: "flex", alignItems: "center", gap: 1, fontFamily: FONT,
                                            cursor: packet.confirmed ? "default" : "pointer", ...focusRing,
                                        }}
                                    >
                                        <Inventory2RoundedIcon aria-hidden="true" sx={{ color: packet.confirmed ? COLORS.success : COLORS.plum }} />
                                        <Box>
                                            <Box sx={{ fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{`Packet ${packet.packet_no}`}</Box>
                                            <Box sx={{ fontSize: 14, color: packet.confirmed ? COLORS.success : COLORS.muted }}>
                                                {packet.confirmed
                                                    ? `${itemCount} ${itemCount === 1 ? "item" : "items"} packed`
                                                    : isActive
                                                        ? "Tick the items below, then press the tick"
                                                        : "Tap to choose items"}
                                            </Box>
                                        </Box>
                                    </Box>

                                    {!packet.confirmed && (
                                        <>
                                            <Box
                                                component="button"
                                                type="button"
                                                aria-label={`Remove packet ${packet.packet_no}`}
                                                onClick={() => handleCancelPacket(packet.temp_id)}
                                                sx={iconButton("#FBE9E7", COLORS.error, false)}
                                            >
                                                <CloseRoundedIcon />
                                            </Box>

                                            <Box
                                                component="button"
                                                type="button"
                                                aria-label={`Confirm packet ${packet.packet_no}`}
                                                disabled={!isActive || selectedItems.length === 0}
                                                onClick={() => handleConfirmPacket(packet.temp_id)}
                                                sx={iconButton(COLORS.success, COLORS.white, !isActive || selectedItems.length === 0)}
                                            >
                                                <CheckRoundedIcon />
                                            </Box>
                                        </>
                                    )}

                                    {packet.confirmed && (
                                        <CheckRoundedIcon aria-label="Packed" sx={{ color: COLORS.success }} />
                                    )}
                                </Box>

                                {/* PACKED ITEMS */}
                                {packet.confirmed && packet.items?.length > 0 && (
                                    <Box sx={{ px: 1.5, pb: 0.5, borderTop: `1px solid ${COLORS.line}` }}>
                                        <PackedPacketItemList
                                            items={packet.items}
                                            onRemoveItem={packet.temp_id
                                                ? (foodItem) => handleRemoveItemFromPacket(packet.temp_id, foodItem)
                                                : undefined}
                                        />
                                    </Box>
                                )}

                            </Box>
                        );
                    })}

                </Box>

            )}


            {/* ORDER ITEMS (not packed yet) */}
            {unpackedItems.length > 0 && (
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 1, mb: 0.75 }}>
                        <Box sx={{ fontSize: 15, fontWeight: 700, color: COLORS.ink }}>
                            {`To pack (${unpackedItems.length})`}
                        </Box>
                        <Box sx={{ fontSize: 14, color: activePacketId ? COLORS.plum : COLORS.muted, textAlign: "right" }}>
                            {activePacketId ? "Choose items for the open packet" : "Make a packet to choose items"}
                        </Box>
                    </Box>

                    {unpackedItems.map((foodItem, foodIndex) => {

                        const quantity = Number(foodItem?.quantity ?? 0);
                        const price = Number(foodItem?.price ?? 0);
                        const gstAmount = Number(foodItem?.gst_amount ?? 0);
                        const total = (price + gstAmount) * quantity;
                        const isSelected = isItemSelected(foodItem);

                        return (
                            <Box
                                key={getItemId(foodItem) ?? foodIndex}
                                component="button"
                                type="button"
                                role="checkbox"
                                aria-checked={isSelected}
                                disabled={!activePacketId}
                                onClick={() => handleItemToggle(foodItem)}
                                sx={{
                                    width: "100%", minHeight: 60, mb: 0.75, px: 1.25, borderRadius: "12px", textAlign: "left",
                                    display: "flex", alignItems: "center", gap: 1.25, fontFamily: FONT,
                                    bgcolor: isSelected ? COLORS.wash : COLORS.white,
                                    border: `${isSelected ? 2 : 1}px solid ${isSelected ? COLORS.plum : COLORS.line}`,
                                    cursor: activePacketId ? "pointer" : "default",
                                    "&:disabled": { opacity: 1 },
                                    ...focusRing,
                                }}
                            >
                                <Box
                                    sx={{
                                        flexShrink: 0, width: 26, height: 26, borderRadius: "8px", display: "grid", placeItems: "center",
                                        bgcolor: isSelected ? COLORS.plum : COLORS.white,
                                        border: `2px solid ${activePacketId ? COLORS.plum : COLORS.orchid}`, color: COLORS.white,
                                    }}
                                >
                                    {isSelected && <CheckRoundedIcon sx={{ fontSize: 18 }} />}
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>{foodItem?.item_name}</Box>
                                    <Box sx={{ fontSize: 14, color: COLORS.muted }}>
                                        {`₹${price.toFixed(2)}${gstAmount > 0 ? `  ·  GST ₹${gstAmount.toFixed(2)}` : ""}  ·  ₹${total.toFixed(2)}`}
                                    </Box>
                                </Box>

                                <Box sx={{ flexShrink: 0, fontSize: 15, fontWeight: 700, color: COLORS.ink }}>{`Qty ${quantity}`}</Box>
                            </Box>
                        );
                    })}
                </Box>
            )}


            {/* PACKING SUMMARY */}
            {displayPackets.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, p: 1.5, borderRadius: "12px", bgcolor: COLORS.white, border: `1px dashed ${COLORS.fieldBorder}` }}>
                    <Box sx={{ fontSize: 15, color: COLORS.muted }}>
                        {`${displayPackets.filter(p => p.confirmed).length} of ${displayPackets.length} packets confirmed`}
                    </Box>
                    <Box sx={{ fontSize: 15, fontWeight: 700, color: COLORS.ink }}>
                        {`${assignedItemIds.size} of ${items.length} items packed`}
                    </Box>
                </Box>
            )}


            {/* TOTAL */}
            {items?.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", pt: 1, borderTop: `1px solid ${COLORS.line}` }}>
                    <Box sx={{ fontSize: 15, color: COLORS.muted }}>Order total</Box>
                    <Box sx={{ fontSize: 20, fontWeight: 700, color: COLORS.ink }}>{`₹${totalAmount.toFixed(2)}`}</Box>
                </Box>
            )}

        </Box>

    );

};


export default memo(
    InstantOrderItemList
);
