
import React, { memo, useMemo } from "react";
import { Box } from "@mui/joy";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import TextComponent from "../../../components/TextComponent";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

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

    /*
    ============================================================
        GROUP EXISTING PACKING BY PACKET UID
    ============================================================
    */

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





    /*
    ============================================================
        CHECK WHETHER PACKING ALREADY EXISTS
    ============================================================
    */

    const hasExistingPacking =
        existingPackets.length > 0;


    /*
    ============================================================
        ACTUAL PACKET COUNT
    ============================================================
    */

    const displayPacketCount = hasExistingPacking
        ? existingPackets.length
        : packetCount;


    /*
    ============================================================
        BUTTON STYLE
    ============================================================
    */

    const buttonStyle = {
        display: "flex",
        alignItems: "center",
        gap: 0.3,
        px: 1,
        py: 0.55,
        borderRadius: "10px",
        color: "#fff",
        cursor: saving
            ? "default"
            : "pointer",
        transition: "all .2s ease",
        opacity: saving ? 0.6 : 1,

        "&:hover": {
            transform: "translateY(-1px)"
        }
    };


    return (
        <Box
            sx={{
                display: hasExistingPacking ? "block" : "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1,
                py: 0.8,
                borderRadius: "12px",

                background:
                    hasExistingPacking
                        ? "linear-gradient(135deg,#f2fff4,#ffffff)"
                        : "linear-gradient(135deg,#f8f4ff,#ffffff)",

                border:
                    hasExistingPacking
                        ? "1px solid #d5efd8"
                        : "1px solid #e9ddff"
            }}
        >

            {/* =================================================
                LEFT : PACKING INFO
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    position: 'relative'
                }}
            >

                <Box
                    sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "9px",

                        background:
                            hasExistingPacking
                                ? "#e4f7e7"
                                : "#eee5ff",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >

                    {hasExistingPacking ? (

                        <CheckCircleRoundedIcon
                            sx={{
                                fontSize: 18,
                                color: "#46a94d"
                            }}
                        />

                    ) : (

                        <Inventory2RoundedIcon
                            sx={{
                                fontSize: 17,
                                color: "#7933ea"
                            }}
                        />

                    )}

                </Box>


                <Box>

                    <TextComponent
                        value={
                            hasExistingPacking
                                ? "ORDER PACKED"
                                : "PACK ORDER"
                        }
                        size={9}
                        weight={900}
                        color={
                            hasExistingPacking
                                ? "#34763b"
                                : "#4b3b65"
                        }
                    />

                    <TextComponent
                        value={`${itemCount} Items • ${displayPacketCount} Packets`}
                        size={7}
                        weight={700}
                        color="#999"
                    />

                </Box>

                {
                    hasExistingPacking &&
                    <Box
                        onClick={() => onPrint(existingPackets)}
                        sx={{
                            display: 'flex',
                            justifyContent: "flex-end",
                            right: 0,
                            position: 'absolute'
                        }}>
                        <LocalPrintshopIcon sx={{
                            color: "#5e2dd9"
                        }} />
                    </Box>
                }

            </Box>


            {/* =================================================
                RIGHT
            ================================================= */}

            {hasExistingPacking ? (

                /*
                =================================================
                    EXISTING PACKETS
                =================================================
                */

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                        flexWrap: "wrap",
                        mt: 1
                        // justifyContent: "flex-end"
                    }}
                >

                    {existingPackets?.map(packet => (

                        <Box
                            onClick={() =>
                                setPacketIds(prev =>
                                    prev === packet?.packet_uid
                                        ? null
                                        : packet?.packet_uid
                                )
                            }
                            key={packet?.packet_uid}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,

                                px: 1.9,
                                py: 1.5,

                                borderRadius: "9px",

                                background: "#ffffff",

                                border:
                                    "1px solid #cfe8d2",

                                boxShadow:
                                    "0 1px 3px rgba(0,0,0,0.04)"
                            }}
                        >

                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "6px",

                                    background:
                                        "#eaf8ec",

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >

                                <Inventory2RoundedIcon
                                    sx={{
                                        fontSize: 12,
                                        color: "#46a94d"
                                    }}
                                />

                            </Box>


                            <Box>

                                <TextComponent
                                    value={packet.packet_uid}
                                    size={9}
                                    weight={900}
                                    color="#34763b"
                                />

                                <TextComponent
                                    value={`${packet.items.length} Items`}
                                    size={6}
                                    weight={700}
                                    color="#999"
                                />

                            </Box>

                        </Box>

                    ))}

                </Box>

            ) : (

                /*
                =================================================
                    NEW PACKING ACTIONS
                =================================================
                */

                <Box
                    sx={{
                        display: "flex",
                        gap: 1
                    }}
                >

                    {/* ADD PACKET */}

                    <Box
                        onClick={
                            saving
                                ? undefined
                                : onAddPacket
                        }
                        sx={{
                            ...buttonStyle,
                            background: "#7933ea",

                            "&:hover": {
                                ...buttonStyle["&:hover"],
                                background: "#6623d0"
                            }
                        }}
                    >

                        <AddRoundedIcon
                            sx={{
                                fontSize: 15
                            }}
                        />

                        <TextComponent
                            value="Packet"
                            size={8}
                            weight={900}
                            color="#fff"
                        />

                    </Box>


                    {/* AUTO PACK */}

                    <Box
                        onClick={
                            saving
                                ? undefined
                                : onAutoPack
                        }
                        sx={{
                            ...buttonStyle,
                            background: "#7933ea",

                            "&:hover": {
                                ...buttonStyle["&:hover"],
                                background: "#6623d0"
                            }
                        }}
                    >

                        <LocalShippingIcon
                            sx={{
                                fontSize: 15
                            }}
                        />

                        <TextComponent
                            value="Auto Packing"
                            size={8}
                            weight={900}
                            color="#fff"
                        />

                    </Box>


                    {/* SUBMIT */}

                    <Box
                        onClick={
                            saving
                                ? undefined
                                : onSubmit
                        }
                        sx={{
                            ...buttonStyle,
                            background: "#46b74d",

                            "&:hover": {
                                ...buttonStyle["&:hover"],
                                background: "#389b40"
                            }
                        }}
                    >

                        <SaveIcon
                            sx={{
                                fontSize: 15
                            }}
                        />

                        <TextComponent
                            value={
                                saving
                                    ? "Saving..."
                                    : "Submit"
                            }
                            size={8}
                            weight={900}
                            color="#fff"
                        />

                    </Box>

                </Box>

            )}

        </Box>
    );
};

export default memo(PackingActionBar);

