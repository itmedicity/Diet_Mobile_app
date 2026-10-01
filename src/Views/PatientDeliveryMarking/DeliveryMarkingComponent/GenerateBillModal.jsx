import React, { useState } from "react";
import {
    Modal,
    ModalDialog,
    Box,
    Typography,
    Button,
    IconButton,
    Radio,
} from "@mui/joy";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const paymentTypes = [
    {
        value: "INPATIENT_CREDIT",
        title: "Inpatient Credit",
        description: "Add to patient's account",
        icon: <LocalHospitalRoundedIcon />,
        color: "#7C3AED",
        bg: "#F3E8FF",
    },
    {
        value: "CASH",
        title: "Cash",
        description: "Pay now",
        icon: <PaymentsRoundedIcon />,
        color: "#16A34A",
        bg: "#ECFDF3",
    },
    {
        value: "BYSTANDER_CREDIT",
        title: "Bystander Credit",
        description: "Credit to bystander",
        icon: <PersonRoundedIcon />,
        color: "#EA8A00",
        bg: "#FFF7E6",
    },
];

const GenerateBillModal = ({
    open,
    onClose,
    onContinue,
}) => {
    const [selectedType, setSelectedType] = useState("CASH");

    const handleContinue = () => {

        if (!selectedType) return;
        onContinue?.(selectedType);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                zIndex: 999999
            }}
        >
            <ModalDialog
                layout="center"
                sx={{
                    width: "90%",
                    maxWidth: 560,
                    p: 0,
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                    border: "1px solid #E5E7EB",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 3,
                        py: 2.5,
                        borderBottom: "1px solid #EAE7EF",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: "14px",
                                background:
                                    "linear-gradient(135deg, #F1E8FF, #E9D5FF)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ReceiptLongRoundedIcon
                                sx={{
                                    fontSize: 26,
                                    color: "#7C3AED",
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                level="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: "#1F2937",
                                    lineHeight: 1.2,
                                }}
                            >
                                Generate Bill
                            </Typography>

                            <Typography
                                level="body-sm"
                                sx={{
                                    color: "#6B7280",
                                    mt: 0.3,
                                }}
                            >
                                Select Bill Pay Type
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        variant="plain"
                        color="neutral"
                        onClick={onClose}
                        sx={{
                            borderRadius: "50%",
                            "&:hover": {
                                backgroundColor: "#F3F4F6",
                            },
                        }}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                </Box>

                {/* Body */}
                <Box sx={{ px: 3, py: 3 }}>
                    <Typography
                        level="title-lg"
                        sx={{
                            fontWeight: 700,
                            color: "#1F2937",
                            mb: 0.5,
                            textTransform: 'uppercase',
                            fontSize: 15
                        }}
                    >
                        Select Pay Type
                    </Typography>

                    <Typography
                        level="body-sm"
                        sx={{
                            color: "#6B7280",
                            mb: 2.5,
                            fontSize: 10
                        }}
                    >
                        Choose how this bill will be paid or settled.
                    </Typography>

                    {/* Payment Options */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                        }}
                    >
                        {paymentTypes?.map((type) => {
                            const selected =
                                selectedType === type.value;

                            return (
                                <Box
                                    key={type.value}
                                    onClick={() =>
                                        setSelectedType(type.value)
                                    }
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.8,
                                        p: 1.8,
                                        borderRadius: "14px",
                                        border: selected
                                            ? `2px solid ${type.color}`
                                            : "1px solid #E2E4E8",
                                        backgroundColor: selected
                                            ? type.bg
                                            : "#FFFFFF",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",

                                        "&:hover": {
                                            borderColor: type.color,
                                            backgroundColor: type.bg,
                                            transform:
                                                "translateY(-1px)",
                                            boxShadow:
                                                "0 4px 12px rgba(0,0,0,0.06)",
                                        },
                                    }}
                                >
                                    {/* Icon */}
                                    <Box
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            minWidth: 38,
                                            borderRadius: "12px",
                                            backgroundColor: type.bg,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {React.cloneElement(type.icon, {
                                            sx: {
                                                fontSize: 20,
                                                color: type.color,
                                            },
                                        })}
                                    </Box>

                                    {/* Text */}
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            level="title-md"
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1F2937",
                                                fontSize: 12
                                            }}
                                        >
                                            {type.title}
                                        </Typography>

                                        <Typography
                                            level="body-sm"
                                            sx={{
                                                color: "#6B7280",
                                                mt: 0.2,
                                                fontSize: 10
                                            }}
                                        >
                                            {type.description}
                                        </Typography>
                                    </Box>

                                    {/* Radio */}
                                    <Radio
                                        checked={selected}
                                        value={type.value}
                                        onChange={() =>
                                            setSelectedType(
                                                type.value
                                            )
                                        }
                                        sx={{
                                            "--Radio-size": "22px",
                                            "--Radio-checked-color":
                                                type.color,
                                            pointerEvents: "none",
                                        }}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1.5,
                        px: 3,
                        py: 2,
                        borderTop: "1px solid #EAE7EF",
                        backgroundColor: "#FAFAFB",
                    }}
                >
                    <Button
                        variant="outlined"
                        color="neutral"
                        onClick={onClose}
                        sx={{
                            minWidth: 100,
                            borderRadius: "10px",
                            fontWeight: 600,
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleContinue}
                        disabled={!selectedType}
                        sx={{
                            minWidth: 130,
                            borderRadius: "10px",
                            fontWeight: 600,
                            background:
                                "linear-gradient(135deg, #7C3AED, #A855F7)",
                            boxShadow:
                                "0 5px 14px rgba(124,58,237,0.25)",

                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #6D28D9, #9333EA)",
                            },
                        }}
                    >
                        Continue
                    </Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
};

export default GenerateBillModal;