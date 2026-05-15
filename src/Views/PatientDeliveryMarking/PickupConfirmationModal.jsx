import React, { memo, useState } from "react";
import {
    Modal,
    ModalDialog,
    Typography,
    Button,
    Sheet,
    Box
} from "@mui/joy";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TextComponent from "../../components/TextComponent";
import { warningNofity } from "../Constant/Constant";


const PickupConfirmationModal = ({
    open,
    onClose,
    onConfirm,
    patientData
}) => {

    const [animating, setAnimating] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        type_desc,
        fb_bdc_no,
        fb_ns_name,
        fb_ptc_name,
        fb_pt_no,
        party_name
    } = patientData || {};

    const handlePickupConfirm = async () => {
        setAnimating(true);
        setLoading(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error(error);
            warningNofity("Error in Pick Uping")
        } finally {
            setTimeout(() => {
                setAnimating(false);
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <Modal open={open}>
            <ModalDialog
                sx={{
                    border: "none",
                    p: 0,
                    overflow: "hidden",
                    borderRadius: "28px",
                    width: 360,
                    bgcolor: "transparent",
                    boxShadow: "none",
                    zIndex: 9999
                }}>
                <Sheet
                    sx={{
                        background:
                            "linear-gradient(180deg, #1E1E1E 0%, #2B2B2B 100%)",
                        color: "#fff",
                        borderRadius: "28px",
                        p: 3,
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            width: 180,
                            height: 180,
                            bgcolor: "#9c42f0",
                            opacity: 0.15,
                            borderRadius: "50%",
                            top: -60,
                            right: -60,
                            filter: "blur(30px)"
                        }} />


                    <Box
                        sx={{
                            position: "relative",
                            height: 90,
                            mb: 2,
                            overflow: "hidden"
                        }}>
                        <Box
                            sx={{
                                position: "absolute",
                                width: "100%",
                                height: 4,
                                bgcolor: "rgba(255,255,255,0.08)",
                                top: "50%",
                                left: 0,
                                borderRadius: 10
                            }}
                        />


                        <Box
                            sx={{
                                width: 85,
                                height: 85,
                                borderRadius: "50%",
                                bgcolor: "#9c42f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "absolute",
                                left: animating
                                    ? "75%"
                                    : "calc(50% - 42px)",
                                transition:
                                    "left 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
                                boxShadow:
                                    "0px 10px 30px rgba(156,66,240,0.45)"
                            }}>
                            {animating && (
                                <>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            left: -25,
                                            width: 20,
                                            height: 4,
                                            bgcolor: "#fff",
                                            borderRadius: 10,
                                            opacity: 0.6
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            position: "absolute",
                                            left: -40,
                                            width: 30,
                                            height: 4,
                                            bgcolor: "#fff",
                                            borderRadius: 10,
                                            opacity: 0.3
                                        }}
                                    />
                                </>
                            )}

                            <DeliveryDiningRoundedIcon
                                sx={{
                                    fontSize: 45,
                                    color: "#fff",
                                    transform: animating
                                        ? "rotate(-8deg)"
                                        : "rotate(0deg)",
                                    transition: "0.4s"
                                }}
                            />
                        </Box>
                    </Box>


                    <Typography
                        level="h3"
                        sx={{
                            textAlign: "center",
                            fontWeight: 800,
                            mb: 1,
                            color: "#fff"
                        }}
                    >
                        Order Assigned
                    </Typography>


                    <Typography
                        sx={{
                            textAlign: "center",
                            color: "#CFCFCF",
                            fontSize: 15,
                            lineHeight: 1.6,
                            mb: 3
                        }}
                    >
                        Did you pick up the food order from kitchen?
                    </Typography>


                    <Box
                        sx={{
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: "24px",
                            p: 2,
                            mb: 3,
                            background:
                                "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                            border: "1px solid rgba(255,255,255,0.08)",
                            backdropFilter: "blur(12px)",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.25)"
                        }}
                    >


                        <Box
                            sx={{
                                position: "absolute",
                                top: -30,
                                right: -30,
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                bgcolor: "#ff6b00",
                                opacity: 0.15,
                                filter: "blur(30px)"
                            }}
                        />


                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1.5
                            }}
                        >
                            <Box>
                                <TextComponent
                                    value={type_desc}
                                    size={18}
                                    weight={800}
                                    color="#fff"
                                />

                                <TextComponent
                                    value={`${party_name} FOOD DELIVERY`}
                                    size={11}
                                    weight={500}
                                    color="#9E9E9E"
                                />
                            </Box>

                            {/* STATUS CHIP */}
                            <Box
                                sx={{
                                    px: 1.5,
                                    py: 0.6,
                                    borderRadius: "30px",
                                    bgcolor: "rgba(255,107,0,0.15)",
                                    border:
                                        "1px solid rgba(255,107,0,0.3)"
                                }}
                            >
                                <TextComponent
                                    value="ASSIGNED"
                                    size={10}
                                    weight={800}
                                    color="#ff9f5a"
                                />
                            </Box>
                        </Box>


                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.2
                            }}
                        >

                            {/* PATIENT */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    bgcolor: "rgba(255,255,255,0.04)",
                                    borderRadius: "14px",
                                    px: 1.5,
                                    py: 1
                                }}
                            >
                                <TextComponent
                                    value="CUSTOMER"
                                    size={11}
                                    weight={600}
                                    color="#8E8E8E"
                                />

                                <TextComponent
                                    value={fb_ptc_name}
                                    size={14}
                                    weight={700}
                                    color="#fff"
                                />
                            </Box>

                            {/* UHID */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    bgcolor: "rgba(255,255,255,0.04)",
                                    borderRadius: "14px",
                                    px: 1.5,
                                    py: 1
                                }}
                            >
                                <TextComponent
                                    value="MRD"
                                    size={11}
                                    weight={600}
                                    color="#8E8E8E"
                                />

                                <TextComponent
                                    value={fb_pt_no}
                                    size={13}
                                    weight={700}
                                    color="#fff"
                                />
                            </Box>

                            {/* BED */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    bgcolor: "rgba(255,255,255,0.04)",
                                    borderRadius: "14px",
                                    px: 1.5,
                                    py: 1
                                }}
                            >
                                <TextComponent
                                    value="BED"
                                    size={11}
                                    weight={600}
                                    color="#8E8E8E"
                                />

                                <TextComponent
                                    value={fb_bdc_no}
                                    size={13}
                                    weight={700}
                                    color="#fff"
                                />
                            </Box>

                            {/* STATION */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    bgcolor: "rgba(255,255,255,0.04)",
                                    borderRadius: "14px",
                                    px: 1.5,
                                    py: 1
                                }}
                            >
                                <TextComponent
                                    value="NS"
                                    size={11}
                                    weight={600}
                                    color="#8E8E8E"
                                />

                                <TextComponent
                                    value={fb_ns_name}
                                    size={13}
                                    weight={700}
                                    color="#fff"
                                />
                            </Box>

                        </Box>
                    </Box>


                    <Box
                        sx={{
                            display: "flex",
                            gap: 1.5
                        }}
                    >
                        <Button
                            fullWidth
                            variant="soft"
                            color="neutral"
                            onClick={onClose}
                            disabled={animating}
                            sx={{
                                borderRadius: "14px",
                                py: 1.4,
                                fontWeight: 700
                            }}
                        >
                            Later
                        </Button>

                        <Button
                            fullWidth
                            startDecorator={
                                !loading && !animating && (
                                    <CheckCircleRoundedIcon />
                                )
                            }
                            onClick={handlePickupConfirm}
                            disabled={loading}
                            loading={loading}
                            sx={{
                                borderRadius: "14px",
                                py: 1.4,
                                fontWeight: 800,
                                bgcolor: "#9c42f0",
                                transition: "0.3s",
                                "&:hover": {
                                    bgcolor: "#9c42f0",
                                    transform: "translateY(-2px)"
                                }
                            }}
                        >
                            {loading || animating
                                ? "Dispatching..."
                                : "Picked Up"}
                        </Button>
                    </Box>

                </Sheet>
            </ModalDialog>
        </Modal>
    );
};

export default memo(PickupConfirmationModal);