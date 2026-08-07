import React, { memo, useMemo, useState, useCallback } from "react";
import {
    Box,
    Card,
    Button,
    Divider,
    Chip,
} from "@mui/joy";

import {
    CreditCardRounded,
    QrCode2Rounded,
    ArrowForwardRounded,
    ReceiptLongRounded,
    KeyboardArrowRightRounded,
    VerifiedUserRounded,
    AccountBalanceWalletRounded,
    CheckCircleRounded,
} from "@mui/icons-material";
import { Input } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import TextComponent from "../../../components/TextComponent";
import PaymentBillDetailList from "./PaymentBillDetailList";
import { warningNofity } from "../../Constant/Constant";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import UploadQrcode from "./UploadQrcode";


const PaymentMethod = () => {

    const [openQrModal, setOpenQrModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const paymentData = location.state ?? {};

    const {
        items = [],
        amount = 0,
        deliveredAmount = 0,
        summary,
        customer
    } = paymentData;

    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [upiId, setUpiId] = useState("");

    const totalItems = useMemo(
        () => items.length,
        [items]
    );


    console.log({
        customer
    });
    
    const handleContinue = useCallback(() => {

        if (paymentMethod === "UPI") {

            if (!upiId.trim()) {
                warningNofity("Please enter the UPI Transaction ID");
                return;
            }

            const upiRegex =
                /^[A-Za-z0-9]{12,35}$/;

            if (!upiRegex.test(upiId.trim())) {
                warningNofity("Please enter a valid Transaction  ID");
                return;
            }
        }

        navigate("/diet/payment/success", {
            state: {
                amount,
                transactionId: upiId,
                paymentMethod: paymentMethod,
                paymentDate: new Date().toLocaleString("en-IN"),
                payerName: customer?.fb_ptc_name,
                payermobile:customer?.fb_ptc_mobile,
                referenceNo: upiId,
                title: "Payment Successful!",
                message: "Your payment has been received successfully.",
                buttonText: "Back to Billing",
            },
        });

    }, [
        navigate,
        items,
        amount,
        deliveredAmount,
        paymentMethod,
        upiId,
    ]);

    if (!location.state) {

        return (

            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                }}
            >

                <TextComponent
                    value="No payment information found."
                    size={22}
                    weight={700}
                />

                <Button
                    color="success"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </Button>

            </Box>

        );

    }

    return (

        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#F5F7FA",
                pb: 2,
            }}
        >

            {/* HEADER */}

            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    px: 2,
                    pt: 1,
                    pb: 1,
                    bgcolor: "#f5f5f7",
                    borderBottom: "1px solid #E5E5E5",
                    backdropFilter: "blur(10px)",
                }}
            >
                <TextComponent
                    value="Complete Payment"
                    size={20}
                    weight={800}
                />

                <TextComponent
                    value="Choose your preferred payment method"
                    size={10}
                    color="#666"
                />
            </Box>

            {/* HERO PAYMENT CARD */}

            <Card
                sx={{
                    mx: 2,
                    p: 3,
                    borderRadius: 6,
                    mt: 2,
                    overflow: "hidden",
                    position: "relative",
                    color: "#ffffff",
                    background:
                        "linear-gradient(135deg,#7c13ec 0%,#c53dff 45%,#7c13ec 100%)",
                    boxShadow:
                        "0 18px 40px rgba(99, 46, 125, 0.35)",
                }}>
                <Box
                    sx={{
                        position: "absolute",
                        width: 180,
                        height: 180,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,.08)",
                        top: -80,
                        right: -60,
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,.06)",
                        bottom: -40,
                        left: -20,
                    }}
                />

                <Box
                    sx={{
                        position: "relative",
                        zIndex: 2,
                    }}
                >

                    <Chip
                        startDecorator={
                            <VerifiedUserRounded
                                sx={{ fontSize: 12 }}
                            />
                        }
                        sx={{
                            bgcolor: "rgba(255,255,255,.16)",
                            color: "#fff",
                            mb: 2,
                            fontWeight: 700,
                            fontSize: 10
                        }}
                    >
                        Secure Hospital Payment
                    </Chip>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >

                        <Box>

                            <TextComponent
                                value="Amount Payable"
                                size={10}
                                color="rgba(255,255,255,.75)"
                            />

                            <TextComponent
                                value={`₹${Number(amount).toFixed(2)}`}
                                size={30}
                                weight={900}
                                color="#fff"
                            />

                        </Box>

                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                bgcolor: "rgba(255,255,255,.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >

                            <AccountBalanceWalletRounded
                                sx={{
                                    fontSize: 26,
                                    color: "#fff",
                                }}
                            />

                        </Box>

                    </Box>

                    <Divider
                        sx={{
                            my: 2,
                            borderColor: "rgba(255,255,255,.18)",
                        }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >

                        <Box>

                            <TextComponent
                                value="Selected Items"
                                size={10}
                                color="rgba(255,255,255,.7)"
                            />

                            <TextComponent
                                value={`${totalItems} Items`}
                                weight={800}
                                color="#fff"
                                size={12}
                            />

                        </Box>

                        <Box>

                            <TextComponent
                                value="Delivered Amount"
                                size={10}
                                color="rgba(255,255,255,.7)"
                            />

                            <TextComponent
                                value={`₹${Number(deliveredAmount).toFixed(2)}`}
                                weight={800}
                                color="#fff"
                                size={12}
                            />

                        </Box>

                    </Box>

                </Box>

            </Card>

            {/* ================= PAYMENT METHOD ================= */}

            <Box
                sx={{
                    px: 2,
                    mt: 3,
                }}
            >
                <TextComponent
                    value="Choose Payment Method"
                    size={20}
                    weight={800}
                />

                <TextComponent
                    value="Select how you'd like to pay"
                    size={10}
                    color="#777"
                />
            </Box>

            {/* CARD */}

            <Card
                onClick={() => setPaymentMethod("CASH")}
                sx={{
                    mx: 2,
                    mt: 2,
                    p: 2,
                    borderRadius: 5,
                    cursor: "pointer",
                    transition: ".25s",

                    border:
                        paymentMethod === "CASH"
                            ? "1px solid #7d2e71"
                            : "1px solid #E4E4E4",

                    bgcolor:
                        paymentMethod === "CASH"
                            ? "#fdf4ff"
                            : "#FFF",

                    boxShadow:
                        paymentMethod === "CASH"
                            ? "0 10px 28px rgba(46,125,50,.15)"
                            : "0 4px 18px rgba(0,0,0,.05)",

                    "&:hover": {
                        transform: "translateY(-3px)",
                    },
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                        }}
                    >

                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                bgcolor: "#f3c1f9",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CreditCardRounded
                                sx={{
                                    fontSize: 24,
                                    color: "#7c13ec",
                                }}
                            />
                        </Box>

                        <Box>

                            <TextComponent
                                value="Cash Payment"
                                weight={700}
                                size={14}
                            />

                            <TextComponent
                                value="Credit / Debit Card"
                                size={10}
                                color="#666"
                            />

                        </Box>

                    </Box>

                    {paymentMethod === "CASH"
                        ? <CheckCircleRounded color="success" />
                        : <KeyboardArrowRightRounded />
                    }

                </Box>

            </Card>

            {/* UPI */}

            <Card
                onClick={() => setPaymentMethod("UPI")}
                sx={{
                    mx: 2,
                    mt: 2,
                    p: 2,
                    borderRadius: 5,
                    cursor: "pointer",
                    transition: ".25s",

                    border:
                        paymentMethod === "UPI"
                            ? "1px solid #720d6a"
                            : "1px solid #E4E4E4",

                    bgcolor:
                        paymentMethod === "UPI"
                            ? "#fff4ff"
                            : "#FFF",

                    boxShadow:
                        paymentMethod === "UPI"
                            ? "0 10px 28px rgba(46,125,50,.15)"
                            : "0 4px 18px rgba(0,0,0,.05)",

                    "&:hover": {
                        transform: "translateY(-3px)",
                    },
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                        }}
                    >

                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                bgcolor: "#fdc0f8",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <QrCode2Rounded
                                sx={{
                                    fontSize: 24,
                                    color: "#7c13ec",
                                }}
                            />
                        </Box>

                        <Box>

                            <TextComponent
                                value="UPI Payment"
                                weight={700}
                                size={14}
                            />

                            <TextComponent
                                value="Fast & Secure"
                                size={10}
                                color="#666"
                            />

                        </Box>

                    </Box>

                    {paymentMethod === "UPI"
                        ? <CheckCircleRounded color="success" />
                        : <KeyboardArrowRightRounded />
                    }

                </Box>

            </Card>


            {/* BILL SUMMARY */}

            <Card
                sx={{
                    mx: 2,
                    mt: 3,
                    p: 2,
                    borderRadius: 5,
                    boxShadow: "0 8px 24px rgba(0,0,0,.06)",
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >

                        <ReceiptLongRounded
                            sx={{
                                color: "#790a6a",
                            }}
                        />

                        <TextComponent
                            value="Bill Summary"
                            size={17}
                            weight={800}
                        />

                    </Box>

                    <Chip
                        sx={{
                            color: '#720d6a'
                        }}
                    >
                        {totalItems} Items
                    </Chip>

                </Box>

                <PaymentBillDetailList
                    items={items}
                    summary={summary}
                />

            </Card>

            {paymentMethod === "UPI" && (
                <Card
                    sx={{
                        mx: 2,
                        mt: 2,
                        p: 2.5,
                        borderRadius: 5,
                        border: "1px solid #e6c8e3",
                        bgcolor: "#f4f4f4",
                        boxShadow: "0 8px 20px rgba(46,125,50,.08)",
                    }}
                >
                    <TextComponent
                        value="Enter your Transaction ID"
                        weight={700}
                        size={15}
                    />

                    <TextComponent
                        value="Please enter the Transaction Id Before complete the Pay!"
                        size={10}
                        color="#666"
                    />

                    <Input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. 123456789012"
                        endDecorator={
                            <QrCode2RoundedIcon
                                onClick={() => setOpenQrModal(true)}
                                sx={{
                                    cursor: "pointer",
                                    color: "#720d6a",
                                    transition: "0.2s",
                                    "&:hover": {
                                        color: "#5b0a55",
                                        transform: "scale(1.1)",
                                    },
                                }}
                            />
                        }
                        sx={{
                            mt: 2,
                            height: 52,
                            borderRadius: 12,

                            "&:hover": {
                                borderColor: "#720d6a",
                            },

                            "&.Mui-focused": {
                                borderColor: "#720d6a",
                                boxShadow: "0 0 0 3px rgba(125, 46, 117, 0.15)",
                            },
                        }}
                    />

                </Card>
            )}


            {/* Floating Continue Button */}

            <Box
                sx={{
                    bottom: 0,
                    mt: 3,
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#fff'
                }}
            >
                <Button
                    fullWidth
                    size="lg"
                    // color="success"
                    startDecorator={<ShoppingCartIcon />}
                    sx={{
                        height: 40,
                        borderRadius: 999,
                        fontWeight: 800,
                        fontSize: 16,
                        width: '90%',
                        boxShadow:
                            "0 12px 30px rgba(125, 46, 116, 0.35)",
                        background:
                            "linear-gradient(135deg,#2E7D32,#43A047)",

                        "&:hover": {
                            background:
                                "linear-gradient(135deg,#723d6a,#720d6a)",
                            transform: "translateY(-2px)",
                        },
                        background: '#7c13ec'
                    }}
                    onClick={handleContinue}
                >
                    Pay ₹{Number(amount).toFixed(2)}
                </Button>
            </Box>


            <UploadQrcode
                open={openQrModal}
                onClose={() => setOpenQrModal(false)}
                qrImage="/images/upi-qr.png"
            />
        </Box>
    );
};

export default memo(PaymentMethod);