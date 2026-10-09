import React, {
    memo,
    useMemo,
    useState,
    useCallback
} from "react";

import { Box, Checkbox, IconButton } from "@mui/joy";

import TextComponent from "../../../components/TextComponent";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SaveIcon from "@mui/icons-material/Save";

import PackedPacketItemList from "./PackedPacketItemList";

import {
    EmpauthId,
    infoNofity,
    succesNofity
} from "../../Constant/Constant";
import { axioslogin } from "../../../Axios/axios";
import { existingPackets } from "../../Constant/Common";
import PackingActionBar from "./PackingActionBar";


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
       GET PACKET ITEM COUNT
     */

    const getPacketItemCount =
        useCallback(
            (packet) => {

                return (
                    packet?.items?.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            Number(
                                item?.quantity ?? 0
                            ),
                        0
                    ) || 0
                );

            },
            []
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
                onPacketsChange
            ]
        );

    /* 
       RENDER
     */

    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2
            }}
        >

            {/* =====================================================
                PACKING HEADER
            ===================================================== */}
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



            {/* =====================================================
                PACKETS
            ===================================================== */}

            {displayPackets.length > 0 && (

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.7
                    }}
                >

                    {displayPackets.map(packet => {

                        const isActive =
                            activePacketId ===
                            (packet.temp_id || packet.packet_uid);

                        const itemCount =
                            getPacketItemCount(
                                packet
                            );


                        return (

                            <Box
                                key={packet.packet_uid || packet.temp_id}
                                sx={{
                                    borderRadius:
                                        "13px",

                                    border:
                                        isActive
                                            ? "1.5px solid #7933ea"
                                            : packet.confirmed
                                                ? "1px solid #cdebd8"
                                                : "1px solid #e6e6e6",

                                    background:
                                        isActive
                                            ? "#faf7ff"
                                            : packet.confirmed
                                                ? "#f7fcf9"
                                                : "#fff",

                                    overflow:
                                        "hidden",

                                    transition:
                                        "all .2s ease"
                                }}
                            >

                                {/* PACKET HEADER */}

                                <Box
                                    onClick={() =>
                                        handleSelectPacket(
                                            packet
                                        )
                                    }
                                    sx={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "space-between",
                                        px: 1,
                                        py: 0.8,
                                        cursor:
                                            packet.confirmed
                                                ? "default"
                                                : "pointer"
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: 0.8
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                width: 30,
                                                height: 30,
                                                borderRadius:
                                                    "9px",

                                                background:
                                                    packet.confirmed
                                                        ? "#e3f5e9"
                                                        : "#eee5ff",

                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center"
                                            }}
                                        >

                                            <Inventory2RoundedIcon
                                                sx={{
                                                    fontSize:
                                                        17,

                                                    color:
                                                        packet.confirmed
                                                            ? "#1c8a4a"
                                                            : "#7933ea"
                                                }}
                                            />

                                        </Box>


                                        <Box>

                                            <TextComponent
                                                value={
                                                    `Packet ${packet.packet_no}`
                                                }
                                                size={9}
                                                weight={900}
                                            />

                                            <TextComponent
                                                value={
                                                    packet.confirmed
                                                        ? `${itemCount} items packed`
                                                        : isActive
                                                            ? "Select items below"
                                                            : "Click to select"
                                                }
                                                size={7}
                                                weight={700}
                                                color={
                                                    packet.confirmed
                                                        ? "#419361"
                                                        : "#999"
                                                }
                                            />

                                        </Box>

                                    </Box>


                                    {/* RIGHT ACTION */}

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: 0.5
                                        }}
                                    >

                                        {/* CANCEL */}

                                        {!packet.confirmed && (

                                            <IconButton
                                                size="sm"
                                                onClick={(
                                                    e
                                                ) => {

                                                    e.stopPropagation();

                                                    handleCancelPacket(
                                                        packet.temp_id
                                                    );

                                                }}
                                                sx={{
                                                    minWidth:
                                                        26,
                                                    width:
                                                        26,
                                                    height:
                                                        26,
                                                    borderRadius:
                                                        "50%",
                                                    color:
                                                        "#d9534f",

                                                    "&:hover":
                                                    {
                                                        background:
                                                            "#fff0ef"
                                                    }
                                                }}
                                            >

                                                <CloseRoundedIcon
                                                    sx={{
                                                        fontSize:
                                                            15
                                                    }}
                                                />

                                            </IconButton>

                                        )}


                                        {/* CONFIRM */}

                                        {!packet.confirmed && (

                                            <IconButton
                                                size="sm"
                                                disabled={
                                                    !isActive ||
                                                    selectedItems.length === 0
                                                }
                                                onClick={(
                                                    e
                                                ) => {

                                                    e.stopPropagation();

                                                    handleConfirmPacket(
                                                        packet.temp_id
                                                    );

                                                }}
                                                sx={{
                                                    minWidth:
                                                        28,
                                                    width:
                                                        28,
                                                    height:
                                                        28,
                                                    borderRadius:
                                                        "50%",

                                                    background:
                                                        selectedItems.length
                                                            ? "#e4f6eb"
                                                            : "#f1f1f1",

                                                    color:
                                                        selectedItems.length
                                                            ? "#188b48"
                                                            : "#aaa",

                                                    "&:hover":
                                                    {
                                                        background:
                                                            "#d5f0df"
                                                    }
                                                }}
                                            >

                                                <CheckRoundedIcon
                                                    sx={{
                                                        fontSize:
                                                            16
                                                    }}
                                                />

                                            </IconButton>

                                        )}


                                        {/* COMPLETED TICK */}

                                        {packet.confirmed && (

                                            <Box
                                                sx={{
                                                    width:
                                                        27,
                                                    height:
                                                        27,
                                                    borderRadius:
                                                        "50%",
                                                    background:
                                                        "#e3f5e9",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center"
                                                }}
                                            >

                                                <CheckRoundedIcon
                                                    sx={{
                                                        fontSize:
                                                            16,
                                                        color:
                                                            "#188b48"
                                                    }}
                                                />

                                            </Box>

                                        )}

                                    </Box>

                                </Box>


                                {/* PACKED ITEMS */}

                                {packet.confirmed &&
                                    packet.items?.length > 0 && (

                                        <Box
                                            sx={{
                                                px: 1,
                                                pb: 0.8
                                            }}
                                        >

                                            <PackedPacketItemList
                                                items={
                                                    packet.items
                                                }
                                                onRemoveItem={(
                                                    foodItem
                                                ) =>
                                                    handleRemoveItemFromPacket(
                                                        packet.temp_id,
                                                        foodItem
                                                    )
                                                }
                                            />

                                        </Box>

                                    )}

                            </Box>

                        );

                    })}

                </Box>

            )}


            {/* =====================================================
                ORDER ITEMS
            ===================================================== */}

            <Box
                sx={{
                    mt: 0.2
                }}
            >

                <Box
                    sx={{
                        display:
                            "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        px: 0.5,
                        mb: 0.7
                    }}
                >

                    <TextComponent
                        value="ORDER ITEMS"
                        size={8}
                        weight={900}
                        color="#777"
                    />

                    <TextComponent
                        value={
                            activePacketId
                                ? "Select items for active packet"
                                : "Create a packet first"
                        }
                        size={7}
                        weight={700}
                        color={
                            activePacketId
                                ? "#7933ea"
                                : "#aaa"
                        }
                    />

                </Box>


                {items
                    ?.filter(foodItem => {

                        const itemId =
                            getItemId(
                                foodItem
                            );

                        return !assignedItemIds.has(
                            itemId
                        );

                    })
                    ?.map(
                        (
                            foodItem,
                            foodIndex
                        ) => {

                            const quantity =
                                Number(
                                    foodItem?.quantity ?? 0
                                );


                            const price =
                                Number(
                                    foodItem?.price ?? 0
                                );


                            const gstAmount =
                                Number(
                                    foodItem?.gst_amount ?? 0
                                );


                            const total =
                                (price +
                                    gstAmount) *
                                quantity;


                            const isSelected =
                                isItemSelected(
                                    foodItem
                                );


                            return (

                                <Box
                                    key={
                                        getItemId(
                                            foodItem
                                        ) ??
                                        foodIndex
                                    }
                                    onClick={() => {

                                        if (
                                            activePacketId
                                        ) {

                                            handleItemToggle(
                                                foodItem
                                            );

                                        }

                                    }}
                                    sx={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: 0.5,
                                        p: 0.9,
                                        mb: 0.6,
                                        borderRadius:
                                            "11px",

                                        bgcolor:
                                            isSelected
                                                ? "#f7f1ff"
                                                : "#fff",

                                        border:
                                            isSelected
                                                ? "1px solid #7933ea"
                                                : "1px solid #eeeeee",

                                        cursor:
                                            activePacketId
                                                ? "pointer"
                                                : "default",

                                        transition:
                                            "all .18s ease",

                                        "&:hover":
                                            activePacketId
                                                ? {
                                                    borderColor:
                                                        "#cbb2f5",
                                                    background:
                                                        "#faf7ff"
                                                }
                                                : {}

                                    }}
                                >

                                    {/* CHECKBOX */}

                                    <Checkbox
                                        checked={
                                            isSelected
                                        }
                                        disabled={
                                            !activePacketId
                                        }
                                        onChange={() =>
                                            handleItemToggle(
                                                foodItem
                                            )
                                        }
                                        onClick={(
                                            e
                                        ) =>
                                            e.stopPropagation()
                                        }
                                        size="sm"
                                        sx={{
                                            "--Checkbox-size":
                                                "20px"
                                        }}
                                    />


                                    {/* ITEM */}

                                    <Box
                                        sx={{
                                            flex:
                                                1,
                                            minWidth:
                                                0
                                        }}
                                    >

                                        <TextComponent
                                            value={
                                                foodItem?.item_name
                                            }
                                            size={9}
                                            weight={800}
                                        />


                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap:
                                                    0.8,
                                                mt:
                                                    0.2
                                            }}
                                        >

                                            <TextComponent
                                                value={
                                                    `₹${price.toFixed(2)}`
                                                }
                                                size={7}
                                                weight={600}
                                                color="#777"
                                            />


                                            {gstAmount > 0 && (

                                                <TextComponent
                                                    value={
                                                        `GST ₹${gstAmount.toFixed(2)}`
                                                    }
                                                    size={7}
                                                    weight={600}
                                                    color="#999"
                                                />

                                            )}


                                            <TextComponent
                                                value={
                                                    `₹${total.toFixed(2)}`
                                                }
                                                size={7}
                                                weight={700}
                                                color="#777"
                                            />

                                        </Box>

                                    </Box>


                                    {/* QUANTITY */}

                                    <Box
                                        sx={{
                                            px:
                                                0.8,
                                            py:
                                                0.4,
                                            borderRadius:
                                                "7px",
                                            background:
                                                "#f6f6f6"
                                        }}
                                    >

                                        <TextComponent
                                            value={
                                                `Qty ${quantity}`
                                            }
                                            size={8}
                                            weight={900}
                                        />

                                    </Box>

                                </Box>

                            );

                        }
                    )}

            </Box>


            {/* =====================================================
                PACKING SUMMARY
            ===================================================== */}

            {displayPackets.length > 0 && (

                <Box
                    sx={{
                        mt: 0.3,
                        p: 1,
                        borderRadius:
                            "11px",
                        background:
                            "#fff",
                        border:
                            "1px dashed #d9d9d9"
                    }}
                >

                    <Box
                        sx={{
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center"
                        }}
                    >

                        <TextComponent
                            value="PACKING SUMMARY"
                            size={7}
                            weight={900}
                            color="#888"
                        />

                        <TextComponent
                            value={
                                `${displayPackets.filter(
                                    p =>
                                        p.confirmed
                                ).length} / ${displayPackets.length} packets confirmed`
                            }
                            size={7}
                            weight={800}
                            color="#7933ea"
                        />

                    </Box>


                    <Box
                        sx={{
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            mt:
                                0.5
                        }}
                    >

                        <TextComponent
                            value="Items packed"
                            size={7}
                            weight={700}
                            color="#888"
                        />

                        <TextComponent
                            value={
                                `${assignedItemIds.size} / ${items.length}`
                            }
                            size={8}
                            weight={900}
                        />

                    </Box>

                </Box>

            )}


            {/* =====================================================
                TOTAL
            ===================================================== */}

            {items?.length > 0 && (

                <Box
                    sx={{
                        display:
                            "flex",
                        justifyContent:
                            "flex-end",
                        alignItems:
                            "center",
                        mt:
                            0.2,
                        pt:
                            0.8,
                        borderTop:
                            "1px dashed #ddd"
                    }}
                >

                    <TextComponent
                        value={
                            `Total: ₹${totalAmount.toFixed(2)}`
                        }
                        size={10}
                        weight={900}
                    />

                </Box>

            )}

        </Box>

    );

};


export default memo(
    InstantOrderItemList
);