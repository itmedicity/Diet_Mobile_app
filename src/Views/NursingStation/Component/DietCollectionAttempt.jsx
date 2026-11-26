
import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalDialog,
    ModalClose,
    Box,
    Button,
    Textarea,
    Typography,
    Divider,
    Chip,
    Input
} from "@mui/joy";

import { useQueryClient } from "@tanstack/react-query";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

import { useAttemptFailureDetails } from "../../../CommonData/UseQuery";
import {
    EmpauthId,
    succesNofity,
    warningNofity
} from "../../Constant/Constant";
import { axioslogin } from "../../../Axios/axios";


const FAILURE_REASONS = [
    {
        value: "PATIENT_NOT_AVAILABLE",
        label: "Patient not available",
        desc: "Patient not found in the room"
    },
    {
        value: "ROOM_LOCKED",
        label: "Room locked",
        desc: "Room was inaccessible"
    },
    {
        value: "PATIENT_SLEEPING",
        label: "Patient sleeping",
        desc: "Patient was resting"
    },
    {
        value: "PATIENT_REFUSED",
        label: "Patient refused",
        desc: "Patient declined the collection"
    },
    {
        value: "PATIENT_SHIFTED",
        label: "Patient shifted",
        desc: "Patient moved to another room"
    },
    {
        value: "ATTENDER_NOT_AVAILABLE",
        label: "Attender not available",
        desc: "Required attender was unavailable"
    },
    {
        value: "OTHER",
        label: "Other reason",
        desc: "Specify the reason in remarks"
    }
];


const FOLLOWUP_STATUS = [
    {
        value: "OPEN",
        label: "Open",
        color: "warning",
        desc: "Waiting for follow-up"
    },
    {
        value: "REVISITED",
        label: "Revisited",
        color: "primary",
        desc: "Patient room visited again"
    },
    {
        value: "ORDER_PLACED",
        label: "Order placed",
        color: "success",
        desc: "Collection completed through an order"
    },
    {
        value: "CLOSED",
        label: "Closed",
        color: "neutral",
        desc: "No further action required"
    }
];


const getCurrentDate = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


const DietCollectionAttempt = ({
    open,
    onClose,
    fullDetail,
}) => {

    const queryClient = useQueryClient();

    // Patient details
    const patientId = fullDetail?.dietpt_slno;
    const admissionId = fullDetail?.ip_no;
    const dietTypeId = fullDetail?.diet_id;
    const nscode = fullDetail?.fb_ns_code;

    // Fetch collection attempts for this patient and admission
    const {
        data: attemptDetails = [],
        isLoading: attemptLoading
    } = useAttemptFailureDetails(patientId, admissionId);


    // Find the latest unresolved collection attempt
    const attemptDetail = attemptDetails.find(item =>
        ["OPEN", "REVISITED"].includes(item?.followup_status)
    ) || null;


    const isUpdate = Boolean(attemptDetail?.attempt_id);

    const [loading, setLoading] = useState(false);

    const [failureReason, setFailureReason] = useState(
        "PATIENT_NOT_AVAILABLE"
    );

    const [remarks, setRemarks] = useState("");

    const [followupStatus, setFollowupStatus] = useState("OPEN");

    const [followupRemarks, setFollowupRemarks] = useState("");

    const [linkedOrderId, setLinkedOrderId] = useState("");


    // Reset modal fields whenever opened or selected attempt changes
    useEffect(() => {

        if (!open) return;

        setFailureReason("PATIENT_NOT_AVAILABLE");
        setRemarks("");

        setFollowupStatus(
            attemptDetail?.followup_status || "OPEN"
        );

        setFollowupRemarks(
            attemptDetail?.followup_remarks || ""
        );

        setLinkedOrderId(
            attemptDetail?.linked_order_id || ""
        );

    }, [open, attemptDetail?.attempt_id]);


    const selectedStatus = FOLLOWUP_STATUS.find(
        item => item.value === followupStatus
    );


    // CREATE COLLECTION FAILURE
    const handleSubmit = async () => {

        if (loading) return;

        if (!patientId || !admissionId) {
            return warningNofity(
                "Patient, admission or diet type details missing"
            );
        }

        if (!failureReason) {
            return warningNofity(
                "Please select a failure reason"
            );
        }

        if (failureReason === "OTHER" && !remarks.trim()) {
            return warningNofity(
                "Please specify the failure reason in remarks"
            );
        }

        setLoading(true);

        try {

            const payload = {
                patient_id: Number(patientId),
                admission_id: admissionId,
                diet_type_id: Number(dietTypeId),
                order_date: getCurrentDate(),
                failure_reason: failureReason,
                remarks: remarks.trim() || null,
                attempted_by: EmpauthId()
            };

            const response = await axioslogin.post(
                "/canteenorder/create-collection-attempt",
                payload
            );

            if (response?.data?.success === 1) {
                await queryClient.invalidateQueries({ queryKey: ["attempt-failure-details", patientId, admissionId] });
                await queryClient.invalidateQueries({ queryKey: ['patientdietplan', nscode] });
                onClose();
                succesNofity("Created Successfully")
            } else {

                warningNofity(
                    response?.data?.message ||
                    "Failed to record collection failure"
                );
            }

        } catch (error) {

            console.error(
                "Create collection attempt error:",
                error?.message || error
            );

            warningNofity(
                error?.response?.data?.message ||
                "Unable to record collection failure"
            );

        } finally {
            setLoading(false);
        }
    };


    // UPDATE COLLECTION FOLLOW-UP
    const handleUpdate = async () => {

        if (loading) return;

        if (!attemptDetail?.attempt_id) {
            return warningNofity(
                "Collection attempt not found"
            );
        }

        if (
            followupStatus === "ORDER_PLACED" &&
            (
                !linkedOrderId ||
                !Number.isInteger(Number(linkedOrderId)) ||
                Number(linkedOrderId) <= 0
            )
        ) {
            return warningNofity(
                "Please enter a valid order ID"
            );
        }

        setLoading(true);

        try {

            const payload = {
                followup_status: followupStatus,
                followup_by: EmpauthId(),
                followup_remarks: followupRemarks.trim() || null,
                linked_order_id:
                    followupStatus === "ORDER_PLACED"
                        ? Number(linkedOrderId)
                        : null
            };

            const response = await axioslogin.patch(
                `/canteenorder/update-collection-attempt/${attemptDetail.attempt_id}`,
                payload
            );

            if (response?.data?.success === 1) {

                await queryClient.invalidateQueries({
                    queryKey: [
                        "attempt-failure-details",
                        patientId,
                        admissionId
                    ]
                });

                onClose();

            } else {

                warningNofity(
                    response?.data?.message ||
                    "Failed to update collection follow-up"
                );
            }

        } catch (error) {

            console.error(
                "Update collection attempt error:",
                error?.message || error
            );

            warningNofity(
                error?.response?.data?.message ||
                "Unable to update collection follow-up"
            );

        } finally {
            setLoading(false);
        }
    };


    // Decide whether to create or update
    const handleAction = () => {

        if (isUpdate) {
            handleUpdate();
        } else {
            handleSubmit();
        }
    };


    const SectionLabel = ({ children }) => (
        <Typography
            sx={{
                fontSize: 12,
                fontWeight: 800,
                color: "#344054",
                mb: 0.8
            }}
        >
            {children}
        </Typography>
    );


    const NativeReasonSelect = () => (
        <Box sx={{ position: "relative", width: "100%" }}>
            <select
                value={failureReason}
                onChange={e => setFailureReason(e.target.value)}
                style={{
                    width: "100%",
                    height: 44,
                    padding: "0 38px 0 13px",
                    border: "1px solid #CDD3DD",
                    borderRadius: 11,
                    outline: "none",
                    backgroundColor: "#fff",
                    color: "#344054",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    appearance: "none",
                    WebkitAppearance: "none",
                    cursor: "pointer",
                    boxSizing: "border-box"
                }}
                onFocus={e => {
                    e.target.style.borderColor = "#D97706";
                    e.target.style.boxShadow =
                        "0 0 0 2px rgba(217,119,6,0.15)";
                }}
                onBlur={e => {
                    e.target.style.borderColor = "#CDD3DD";
                    e.target.style.boxShadow = "none";
                }}
            >
                {FAILURE_REASONS.map(item => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>

            <KeyboardArrowDownRoundedIcon
                sx={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#667085",
                    pointerEvents: "none"
                }}
            />
        </Box>
    );


    return (
        <Modal
            open={open}
            onClose={loading ? undefined : onClose}
        >
            <ModalDialog
                layout="center"
                sx={{
                    width: "min(450px, calc(100% - 24px))",
                    maxHeight: "88vh",
                    overflow: "hidden",
                    p: 0,
                    borderRadius: "22px",
                    boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                    border: "1px solid #E9EDF3",
                    gap: 0,
                    zIndex: 999999
                }}
            >

                {/* HEADER */}
                <Box
                    sx={{
                        p: 2.5,
                        pb: 2,
                        bgcolor: isUpdate ? "#F5F3FF" : "#FFFAF2",
                        position: "relative",
                        flexShrink: 0
                    }}
                >
                    <ModalClose
                        disabled={loading}
                        sx={{
                            top: 14,
                            right: 14,
                            borderRadius: "8px"
                        }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                flexShrink: 0,
                                borderRadius: "14px",
                                bgcolor: isUpdate ? "#EDE9FE" : "#FEF0D7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {isUpdate ? (
                                <UpdateRoundedIcon
                                    sx={{
                                        color: "#7C3AED",
                                        fontSize: 25
                                    }}
                                />
                            ) : (
                                <PersonOffOutlinedIcon
                                    sx={{
                                        color: "#D97706",
                                        fontSize: 25
                                    }}
                                />
                            )}
                        </Box>

                        <Box sx={{ minWidth: 0, pr: 3 }}>
                            <Typography
                                sx={{
                                    fontSize: 17,
                                    fontWeight: 850,
                                    color: "#202939",
                                    letterSpacing: "-0.4px"
                                }}
                            >
                                {isUpdate
                                    ? "Collection Follow-up"
                                    : "Report Collection Failure"}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color: "#667085",
                                    mt: 0.3
                                }}
                            >
                                {isUpdate
                                    ? "Review and update the follow-up status"
                                    : "Record an unsuccessful patient collection"}
                            </Typography>
                        </Box>
                    </Box>

                    {isUpdate && (
                        <Box sx={{ mt: 1.5 }}>
                            <Chip
                                size="sm"
                                color={selectedStatus?.color || "warning"}
                                variant="soft"
                                startDecorator={
                                    <EventAvailableOutlinedIcon />
                                }
                            >
                                {selectedStatus?.label || "Open"}
                            </Chip>
                        </Box>
                    )}
                </Box>


                {/* CONTENT */}
                <Box
                    sx={{
                        p: 2.5,
                        overflowY: "auto",
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                    }}
                >

                    {attemptLoading ? (
                        <Typography
                            fontSize={12}
                            color="neutral"
                            textAlign="center"
                        >
                            Loading collection details...
                        </Typography>
                    ) : !isUpdate ? (

                        <>
                            {/* FAILURE REASON */}
                            <Box>
                                <SectionLabel>
                                    Reason for failed collection
                                </SectionLabel>

                                <NativeReasonSelect />

                                <Typography
                                    fontSize={10}
                                    color="neutral"
                                    sx={{ mt: 0.7 }}
                                >
                                    {
                                        FAILURE_REASONS.find(
                                            item => item.value === failureReason
                                        )?.desc
                                    }
                                </Typography>
                            </Box>


                            {/* REMARKS */}
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <SectionLabel>
                                        Additional remarks
                                    </SectionLabel>

                                    <Typography
                                        fontSize={10}
                                        color="neutral"
                                    >
                                        Optional
                                    </Typography>
                                </Box>

                                <Textarea
                                    minRows={3}
                                    maxRows={5}
                                    placeholder="Add details about the failed collection..."
                                    value={remarks}
                                    onChange={e =>
                                        setRemarks(e.target.value)
                                    }
                                    sx={{
                                        borderRadius: "11px",
                                        fontSize: 12,
                                        bgcolor: "#fff",
                                        "--Textarea-focusedHighlight": "#D97706"
                                    }}
                                />
                            </Box>


                            {/* INFORMATION */}
                            <Box
                                sx={{
                                    p: 1.5,
                                    bgcolor: "#FFFAF2",
                                    border: "1px solid #F5E4C6",
                                    borderRadius: "11px",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1
                                }}
                            >
                                <ReportProblemOutlinedIcon
                                    sx={{
                                        fontSize: 17,
                                        color: "#D97706",
                                        mt: 0.1
                                    }}
                                />

                                <Typography
                                    fontSize={10}
                                    color="#875B1C"
                                    lineHeight={1.6}
                                >
                                    This will record a failed collection
                                    attempt. The original diet order will
                                    remain unchanged.
                                </Typography>
                            </Box>
                        </>

                    ) : (

                        <>
                            {/* ORIGINAL FAILURE */}
                            <Box
                                sx={{
                                    p: 1.7,
                                    borderRadius: "13px",
                                    bgcolor: "#FFF9F0",
                                    border: "1px solid #F5E4C6"
                                }}
                            >
                                <Typography
                                    fontSize={10}
                                    fontWeight={800}
                                    color="#A16207"
                                    sx={{
                                        textTransform: "uppercase",
                                        letterSpacing: 0.6
                                    }}
                                >
                                    Original failure
                                </Typography>

                                <Typography
                                    fontSize={13}
                                    fontWeight={800}
                                    color="#344054"
                                    mt={0.7}
                                >
                                    {FAILURE_REASONS.find(
                                        item =>
                                            item.value ===
                                            attemptDetail?.failure_reason
                                    )?.label || attemptDetail?.failure_reason}
                                </Typography>

                                {attemptDetail?.remarks && (
                                    <Typography
                                        fontSize={11}
                                        color="#667085"
                                        mt={0.6}
                                    >
                                        {attemptDetail.remarks}
                                    </Typography>
                                )}

                                {attemptDetail?.attempted_at && (
                                    <Typography
                                        fontSize={10}
                                        color="neutral"
                                        mt={1}
                                    >
                                        Attempted: {attemptDetail.attempted_at}
                                    </Typography>
                                )}
                            </Box>


                            <Divider />


                            {/* FOLLOW-UP STATUS */}
                            <Box>
                                <SectionLabel>
                                    Update follow-up status
                                </SectionLabel>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.8
                                    }}
                                >
                                    {FOLLOWUP_STATUS.map(item => {

                                        const active =
                                            followupStatus === item.value;

                                        return (
                                            <Box
                                                key={item.value}
                                                onClick={() => {
                                                    if (!loading) {
                                                        setFollowupStatus(
                                                            item.value
                                                        );
                                                    }
                                                }}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.2,
                                                    p: 1.2,
                                                    borderRadius: "11px",
                                                    cursor: loading
                                                        ? "default"
                                                        : "pointer",
                                                    border: active
                                                        ? "1.5px solid #9D25B8"
                                                        : "1px solid #E5E7EB",
                                                    bgcolor: active
                                                        ? "#FAF5FF"
                                                        : "#fff",
                                                    transition: "0.15s",
                                                    "&:hover": {
                                                        bgcolor: "#FAF5FF"
                                                    }
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 19,
                                                        height: 19,
                                                        borderRadius: "50%",
                                                        border: active
                                                            ? "6px solid #9D25B8"
                                                            : "1.5px solid #C4CAD4",
                                                        flexShrink: 0,
                                                        boxSizing: "border-box"
                                                    }}
                                                />

                                                <Box sx={{ flex: 1 }}>
                                                    <Typography
                                                        fontSize={12}
                                                        fontWeight={800}
                                                        color="#344054"
                                                    >
                                                        {item.label}
                                                    </Typography>

                                                    <Typography
                                                        fontSize={10}
                                                        color="neutral"
                                                    >
                                                        {item.desc}
                                                    </Typography>
                                                </Box>

                                                {active && (
                                                    <CheckCircleOutlineRoundedIcon
                                                        sx={{
                                                            fontSize: 17,
                                                            color: "#9D25B8"
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>


                            {/* LINKED ORDER */}
                            {followupStatus === "ORDER_PLACED" && (
                                <Box>
                                    <SectionLabel>
                                        Linked order ID
                                    </SectionLabel>

                                    <Input
                                        type="number"
                                        value={linkedOrderId}
                                        onChange={e =>
                                            setLinkedOrderId(e.target.value)
                                        }
                                        placeholder="Enter created order ID"
                                        sx={{
                                            borderRadius: "10px",
                                            fontSize: 12,
                                            minHeight: 42
                                        }}
                                    />
                                </Box>
                            )}


                            {/* FOLLOW-UP REMARKS */}
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <SectionLabel>
                                        Follow-up remarks
                                    </SectionLabel>

                                    <Typography
                                        fontSize={10}
                                        color="neutral"
                                    >
                                        Optional
                                    </Typography>
                                </Box>

                                <Textarea
                                    minRows={3}
                                    maxRows={5}
                                    placeholder="Describe the follow-up action taken..."
                                    value={followupRemarks}
                                    onChange={e =>
                                        setFollowupRemarks(e.target.value)
                                    }
                                    sx={{
                                        borderRadius: "11px",
                                        fontSize: 12,
                                        bgcolor: "#fff",
                                        "--Textarea-focusedHighlight": "#9D25B8"
                                    }}
                                />
                            </Box>
                        </>
                    )}

                </Box>


                {/* FOOTER */}
                <Divider />

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        p: 2,
                        bgcolor: "#fff",
                        flexShrink: 0
                    }}
                >
                    <Button
                        fullWidth
                        variant="outlined"
                        color="neutral"
                        onClick={onClose}
                        disabled={loading}
                        sx={{
                            borderRadius: "11px",
                            fontWeight: 700,
                            minHeight: 42
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        fullWidth
                        loading={loading}
                        disabled={loading || attemptLoading}
                        startDecorator={
                            isUpdate
                                ? <UpdateRoundedIcon />
                                : <SendRoundedIcon />
                        }
                        onClick={handleAction}
                        color={isUpdate ? "primary" : "warning"}
                        sx={{
                            borderRadius: "11px",
                            fontWeight: 800,
                            minHeight: 42,
                            bgcolor: isUpdate ? "#9D25B8" : "#D97706",
                            "&:hover": {
                                bgcolor: isUpdate ? "#861C9F" : "#B45309"
                            }
                        }}
                    >
                        {isUpdate
                            ? "Save Follow-up"
                            : "Submit Failure"}
                    </Button>
                </Box>

            </ModalDialog>
        </Modal>
    );
};

export default DietCollectionAttempt;
