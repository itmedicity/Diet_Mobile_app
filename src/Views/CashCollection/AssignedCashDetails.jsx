
import React, { memo, useCallback, useMemo, useState } from "react";
import { Box, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";

import { EmpauthId } from "../Constant/Constant";
import { useAssignedBillDetails } from "../../CommonData/UseQuery";
import AssignedCashCardSkeleton from "./CollectionComponent/AssignedCashCardSkeleton";
import AssignedCashCard from "./CollectionComponent/AssignedCashCard";

const AssignedCashDetails = () => {
    const id = EmpauthId();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("PENDING");

    const {
        data: BillDetails = [],
        isLoading,
    } = useAssignedBillDetails(id);

    const bills = useMemo(() => {
        if (Array.isArray(BillDetails)) {
            return BillDetails;
        }

        if (Array.isArray(BillDetails?.data)) {
            return BillDetails.data;
        }

        return [];
    }, [BillDetails]);

    const pendingBills = useMemo(
        () =>
            bills.filter(
                (bill) =>
                    bill?.collection_display_status !== "COMPLETED"
            ),
        [bills]
    );

    const completedBills = useMemo(
        () =>
            bills.filter(
                (bill) =>
                    bill?.collection_display_status === "COMPLETED"
            ),
        [bills]
    );

    // Display only the bills belonging to the selected tab.
    const displayedBills =
        activeTab === "PENDING" ? pendingBills : completedBills;

    const handleCardClick = useCallback(
        (bill) => {
            navigate(
                `/cash-collection/collection/${bill?.billing_id}`
            );
        },
        [navigate]
    );

    const formatCurrency = useCallback((amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(amount) || 0);
    }, []);

    const renderBills = useCallback(
        (items) =>
            items.map((bill) => (
                <AssignedCashCard
                    key={
                        bill?.assignment_detail_id ??
                        bill?.billing_id
                    }
                    bill={bill}
                    onClick={handleCardClick}
                    formatCurrency={formatCurrency}
                />
            )),
        [handleCardClick, formatCurrency]
    );

    const pendingAmount = useMemo(
        () =>
            pendingBills.reduce(
                (sum, bill) =>
                    sum + (Number(bill?.balance_amount) || 0),
                0
            ),
        [pendingBills]
    );

    return (
        <Box
            sx={{
                width: "100%",
                height: "100dvh",
                background: "#F7F7F5",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
                fontFamily: "Bahnschrift",
            }}
        >
            {/* HEADER */}
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    width: "100%",
                    background: "rgba(247, 247, 245, 0.96)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid #E2E2DD",
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "480px",
                        mx: "auto",
                        px: { xs: 1.5, sm: 2.5 },
                        py: 1.1,
                        boxSizing: "border-box",
                    }}
                >
                    {/* TITLE */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "11px",
                                background: "#FFFFFF",
                                border: "1px solid #E2E2DD",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#3730A3",
                                fontSize: "1.1rem",
                                fontWeight: 900,
                                flexShrink: 0,
                            }}
                        >
                            ₹
                        </Box>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                                sx={{
                                    fontFamily: "Bahnschrift",
                                    fontSize: {
                                        xs: "0.88rem",
                                        sm: "1rem",
                                    },
                                    fontWeight: 900,
                                    color: "#191919",
                                    lineHeight: 1.15,
                                }}
                            >
                                CASH COLLECTION
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.3,
                                    fontFamily: "Bahnschrift",
                                    fontSize: "0.62rem",
                                    color: "#858580",
                                    fontWeight: 700,
                                }}
                            >
                                {pendingBills.length} pending
                                {" · "}
                                {completedBills.length} completed today
                            </Typography>
                        </Box>
                    </Box>

                    {/* SELECTABLE SUMMARY TABS */}
                    {!isLoading && bills.length > 0 && (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 1,
                                mt: 1.2,
                                p: 0.5,
                                bgcolor: "#F1F1ED",
                                borderRadius: "12px",
                            }}
                        >
                            {/* PENDING TAB */}
                            <Box
                                role="button"
                                tabIndex={0}
                                aria-pressed={activeTab === "PENDING"}
                                onClick={() => setActiveTab("PENDING")}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                    ) {
                                        event.preventDefault();
                                        setActiveTab("PENDING");
                                    }
                                }}
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: "9px",
                                    px: 1.2,
                                    py: 1.1,
                                    bgcolor:
                                        activeTab === "PENDING"
                                            ? "#FFFFFF"
                                            : "transparent",
                                    border:
                                        activeTab === "PENDING"
                                            ? "1px solid #F3D5A5"
                                            : "1px solid transparent",
                                    boxShadow:
                                        activeTab === "PENDING"
                                            ? "0 1px 3px rgba(0,0,0,0.06)"
                                            : "none",
                                    transition: "all 0.2s ease",
                                    outline: "none",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: "Bahnschrift",
                                        fontSize: "0.65rem",
                                        fontWeight: 800,
                                        color:
                                            activeTab === "PENDING"
                                                ? "#B45309"
                                                : "#858580",
                                    }}
                                >
                                    PENDING
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.35,
                                        fontFamily: "Bahnschrift",
                                        fontSize: "1rem",
                                        fontWeight: 900,
                                        color: "#B45309",
                                    }}
                                >
                                    {formatCurrency(pendingAmount)}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.2,
                                        fontFamily: "Bahnschrift",
                                        fontSize: "0.65rem",
                                        fontWeight: 700,
                                        color: "#858580",
                                    }}
                                >
                                    {pendingBills.length} bills to collect
                                </Typography>
                            </Box>

                            {/* COMPLETED TAB */}
                            <Box
                                role="button"
                                tabIndex={0}
                                aria-pressed={activeTab === "COMPLETED"}
                                onClick={() => setActiveTab("COMPLETED")}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                    ) {
                                        event.preventDefault();
                                        setActiveTab("COMPLETED");
                                    }
                                }}
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: "9px",
                                    px: 1.2,
                                    py: 1.1,
                                    bgcolor:
                                        activeTab === "COMPLETED"
                                            ? "#FFFFFF"
                                            : "transparent",
                                    border:
                                        activeTab === "COMPLETED"
                                            ? "1px solid #BBE7C9"
                                            : "1px solid transparent",
                                    boxShadow:
                                        activeTab === "COMPLETED"
                                            ? "0 1px 3px rgba(0,0,0,0.06)"
                                            : "none",
                                    transition: "all 0.2s ease",
                                    outline: "none",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: "Bahnschrift",
                                        fontSize: "0.65rem",
                                        fontWeight: 800,
                                        color:
                                            activeTab === "COMPLETED"
                                                ? "#15803D"
                                                : "#858580",
                                    }}
                                >
                                    COMPLETED
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.35,
                                        fontFamily: "Bahnschrift",
                                        fontSize: "1rem",
                                        fontWeight: 900,
                                        color: "#15803D",
                                    }}
                                >
                                    {completedBills.length}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.2,
                                        fontFamily: "Bahnschrift",
                                        fontSize: "0.65rem",
                                        fontWeight: 700,
                                        color: "#858580",
                                    }}
                                >
                                    Bills collected
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* SCROLLABLE BILL LIST */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "480px",
                    mx: "auto",
                    px: { xs: 1.5, sm: 2.5 },
                    pt: 1.2,
                    pb: 2,
                    boxSizing: "border-box",
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                        width: 3,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#D0D0CB",
                        borderRadius: 10,
                    },
                }}
            >
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <AssignedCashCardSkeleton key={index} />
                    ))
                ) : bills.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: "center" }}>
                        <Typography
                            sx={{
                                fontFamily: "Bahnschrift",
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                color: "#888",
                            }}
                        >
                            No assigned collection bills
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* ACTIVE TAB HEADING */}
                        <Typography
                            sx={{
                                fontFamily: "Bahnschrift",
                                fontSize: "0.7rem",
                                fontWeight: 900,
                                color:
                                    activeTab === "PENDING"
                                        ? "#B45309"
                                        : "#15803D",
                                mb: 1,
                                letterSpacing: "0.04em",
                            }}
                        >
                            {activeTab === "PENDING"
                                ? `PENDING COLLECTIONS (${displayedBills.length})`
                                : `COMPLETED TODAY (${displayedBills.length})`}
                        </Typography>

                        {/* FILTERED BILLS */}
                        {displayedBills.length > 0 ? (
                            renderBills(displayedBills)
                        ) : (
                            <Box
                                sx={{
                                    py: 6,
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: "Bahnschrift",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        color: "#888",
                                    }}
                                >
                                    {activeTab === "PENDING"
                                        ? "No pending collection bills"
                                        : "No completed collections today"}
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default memo(AssignedCashDetails);
