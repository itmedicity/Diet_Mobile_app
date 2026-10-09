import React from "react";
import { Box, Button, Card } from "@mui/joy";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import Pride from "react-canvas-confetti/dist/presets/pride";
import randomInRange from "react-canvas-confetti/dist/helpers/randomInRange";
import { useLocation, useNavigate } from "react-router-dom";
import TextComponent from "../../../components/TextComponent";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";


const PaymentSuccessPage = () => {

    const navigate = useNavigate();
    const { state } = useLocation();

    const {
        amount = 0,
        transactionId = "",
        paymentMethod = "UPI",
        paymentDate = "",
        payerName = "",
        referenceNo = "",
        payermobile,
        message = "Your payment has been completed successfully.",
        title = "Payment Successful!",
        buttonText = "Back to Billing",
        showCelebration = true,
    } = state ?? {};

    const decorateOptions = (defaultOptions) => ({
        ...defaultOptions,
        colors: [
            "#7C13EC",
            "#C53DFF",
            "#E879F9",
            "#A855F7",
        ],
        scalar: randomInRange(0.7, 1.2),
        particleCount: randomInRange(3, 8),
    });

//     const handleShare = () => {
//         const shareText = `🏥 *TRAVANCORE MEDICITY*

// ══════════════════════
//         PAYMENT RECEIPT
// ══════════════════════

// Patient / Payer : ${payerName}
// Amount Paid     : ₹${Number(amount).toLocaleString("en-IN")}
// Payment Method  : ${paymentMethod}
// Transaction ID  : ${transactionId}
// Reference No    : ${referenceNo}
// Payment Date    : ${paymentDate}

// Status          : ✅ SUCCESSFUL

// ══════════════════════

// Thank you for your payment.

// This is a computer-generated payment receipt and does not require a signature.

// - Travancore Medicity
// `;
//         // Remove spaces, +, -, etc.
//         const mobile = String(9846009616 || "").replace(/\D/g, "");

//         if (!mobile) {
//             alert("Mobile number not available");
//             return;
//         }

//         window.open(
//             `https://wa.me/91${mobile}?text=${encodeURIComponent(shareText)}`,
//             "_blank"
//         );
//     };

    const Row = ({ label, value, icon }) =>
        value ? (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1,
                }}
            >
                <TextComponent
                    value={label}
                    size={13}
                    color="#6B7280"
                />

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    {icon}

                    <TextComponent
                        value={value}
                        size={13}
                        weight={700}
                        color="#111827"
                    />
                </Box>
            </Box>
        ) : null;

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#F8F5FF",
                px: 2,
                position: "relative",
            }}
        >
            {showCelebration && (
                <Pride
                    autorun={{ speed: 18 }}
                    decorateOptions={decorateOptions}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                />
            )}

            <Card
                sx={{
                    width: "100%",
                    maxWidth: 430,
                    borderRadius: 5,
                    overflow: "hidden",
                    boxShadow: "0 18px 45px rgba(124,19,236,.12)",
                }}
            >
                <Box
                    sx={{
                        background:
                            "linear-gradient(135deg,#7C13EC,#C53DFF)",
                        py: 5,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: 110,
                            height: 110,
                            bgcolor: "#fff",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0 8px 25px rgba(0,0,0,.15)",
                            animation: "pop .4s ease",

                            "@keyframes pop": {
                                "0%": {
                                    transform: "scale(.5)",
                                    opacity: 0,
                                },
                                "100%": {
                                    transform: "scale(1)",
                                    opacity: 1,
                                },
                            },
                        }}
                    >
                        <CheckCircleRoundedIcon
                            sx={{
                                fontSize: 70,
                                color: "#7C13EC",
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                    <TextComponent
                        value={title}
                        size={24}
                        weight={800}
                        color="#7C13EC"
                    />

                    <Box sx={{ mt: 1 }}>
                        <TextComponent
                            value={message}
                            size={14}
                            color="#6B7280"
                        />
                    </Box>

                    <Card
                        variant="soft"
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 4,
                            textAlign: "center",
                            bgcolor: "#FCF6FF",
                            border: "1px solid #F0D8FF",
                        }}
                    >
                        <TextComponent
                            value="Amount Paid"
                            size={13}
                            color="#6B7280"
                        />

                        <TextComponent
                            value={`₹ ${Number(amount).toLocaleString("en-IN")}`}
                            size={34}
                            weight={800}
                            color="#111827"
                        />
                    </Card>


                    <Card
                        variant="outlined"
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 4,
                        }}
                    >

                        <Row
                            label="Payment Method"
                            value={paymentMethod}
                            icon={
                                <AccountBalanceWalletRoundedIcon
                                    sx={{
                                        fontSize: 18,
                                        color: "#7C13EC",
                                    }}
                                />
                            }
                        />

                        <Row
                            label="Payment Date"
                            value={paymentDate}
                        />

                        <Row
                            label="Paid By"
                            value={payerName}
                        />

                        <Row
                            label="Reference No"
                            value={referenceNo}
                        />
                    </Card>

                    <Button
                        fullWidth
                        onClick={() => navigate("/delivery")}
                        sx={{
                            mt: 4,
                            py: 1.6,
                            borderRadius: 30,
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#fff",
                            background:
                                "linear-gradient(135deg,#7C13EC,#C53DFF)",
                            boxShadow:
                                "0 10px 25px rgba(124,19,236,.35)",

                            "&:hover": {
                                background:
                                    "linear-gradient(135deg,#6D10D5,#B82EFF)",
                            },
                        }}
                    >
                        {buttonText}
                    </Button>
                    {/* <Button
                        variant="outlined"
                        startDecorator={<ShareRoundedIcon />}
                        onClick={handleShare}
                        sx={{
                            mt: 2,
                            width: "100%",
                            borderRadius: 30,
                        }}
                    >
                        Share Receipt
                    </Button> */}
                </Box>
            </Card>
        </Box>
    );
};

export default PaymentSuccessPage;