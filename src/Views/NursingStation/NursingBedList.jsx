
import React, { memo } from "react";
import { Box, Button, Chip, Tooltip } from "@mui/joy";
import { useNavigate } from "react-router-dom";

import TextComponent from "../../components/TextComponent";
import BedIcon from "@mui/icons-material/Bed";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { PatientstatusConfig } from "../../CommonData/Common";
import { infoNofity } from "../Constant/Constant";

const FOLLOWUP_CONFIG = {
    OPEN: {
        label: "OPEN",
        color: "warning"
    },
    REVISITED: {
        label: "REVISITED",
        color: "primary"
    },
    ORDER_PLACED: {
        label: "ORDER PLACED",
        color: "success"
    },
    CLOSED: {
        label: "CLOSED",
        color: "neutral"
    }
};

const FAILURE_REASON_LABELS = {
    PATIENT_NOT_AVAILABLE: "Patient Not Available",
    ROOM_LOCKED: "Room Locked",
    PATIENT_SLEEPING: "Patient Sleeping",
    PATIENT_REFUSED: "Patient Refused",
    PATIENT_SHIFTED: "Patient Shifted",
    ATTENDER_NOT_AVAILABLE: "Attender Not Available",
    OTHER: "Other"
};

const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
};

const NursingBedList = ({
    beds = [],
    stationname,
    Refech,
}) => {
    const navigate = useNavigate();

    const handlebedDetail = (
        code,
        name,
        templateId,
        item,
        isBlocked,
        admissionstatus
    ) => {
        if (isBlocked) {
            return infoNofity(
                `The Patient ${admissionstatus?.label} have Done.`
            );
        }

        navigate("/bedId", {
            state: {
                BedCode: code,
                BedName: name,
                stationname,
                template_id: templateId,
                fullDetail: item
            }
        });
    };

    const OrderIndicator = ({ label, hasOrder }) => (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                minWidth: 0
            }}
        >
            {hasOrder ? (
                <CheckCircleOutlineIcon
                    sx={{ fontSize: 14, color: "#25834b" }}
                />
            ) : (
                <RadioButtonUncheckedIcon
                    sx={{ fontSize: 14, color: "#aaa2ae" }}
                />
            )}

            <TextComponent
                value={label}
                size={10}
                weight={700}
                color={hasOrder ? "#25834b" : "#89818e"}
                noWrap
            />
        </Box>
    );

    const CollectionAttemptDetails = ({ item }) => {
        const attemptId = item?.collection_attempt_id;

        if (!attemptId) return null;

        const status =
            FOLLOWUP_CONFIG[item?.followup_status] || {
                label: item?.followup_status || "UNKNOWN",
                color: "neutral"
            };

        const failureReason =
            FAILURE_REASON_LABELS[item?.failure_reason] ||
            item?.failure_reason ||
            "Unknown";

        return (
            <Box
                sx={{
                    mt: 1,
                    p: 1,
                    borderRadius: "9px",
                    bgcolor:
                        item?.followup_status === "OPEN"
                            ? "#fff8ed"
                            : "#f8f5fa",
                    border: "1px solid",
                    borderColor:
                        item?.followup_status === "OPEN"
                            ? "#f2d6a9"
                            : "#e9e0ed"
                }}
            >
                {/* Attempt heading */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        mb: 0.8
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            minWidth: 0
                        }}
                    >
                        <ReportProblemOutlinedIcon
                            sx={{
                                fontSize: 16,
                                color: "#c17b27"
                            }}
                        />

                        <TextComponent
                            value="Collection Failed"
                            size={11}
                            weight={800}
                            color="#754b18"
                        />
                    </Box>

                    <Chip
                        size="sm"
                        color={status.color}
                        variant="soft"
                        sx={{
                            height: 20,
                            fontSize: 9,
                            fontWeight: 800,
                            borderRadius: "6px",
                            flexShrink: 0
                        }}
                    >
                        {status.label}
                    </Chip>
                </Box>

                {/* Failure reason */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 0.5
                    }}
                >
                    <TextComponent
                        value="Reason:"
                        size={10}
                        weight={700}
                        color="#756579"
                    />

                    <TextComponent
                        value={failureReason}
                        size={10}
                        weight={800}
                        color="#47354e"
                    />
                </Box>

                {/* Collection remarks */}
                {item?.collection_remarks && (
                    <Box sx={{ mt: 0.5 }}>
                        <TextComponent
                            value="Collection Remarks"
                            size={9}
                            weight={800}
                            color="#8a778e"
                        />

                        <TextComponent
                            value={item.collection_remarks}
                            size={10}
                            color="#594b5e"
                        />
                    </Box>
                )}

                {/* Follow-up remarks */}
                {item?.followup_remarks && (
                    <Box
                        sx={{
                            mt: 0.7,
                            pt: 0.7,
                            borderTop: "1px dashed #e5d9e8"
                        }}
                    >
                        <TextComponent
                            value="Follow-up Remarks"
                            size={9}
                            weight={800}
                            color="#8a778e"
                        />

                        <TextComponent
                            value={item.followup_remarks}
                            size={10}
                            color="#594b5e"
                        />
                    </Box>
                )}

                {/* Attempt information */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1.5,
                        mt: 0.8,
                        pt: 0.7,
                        borderTop: "1px solid #eee4ef"
                    }}
                >
                    <Tooltip title="Attempted by">
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.4
                            }}
                        >
                            <PersonOutlineRoundedIcon
                                sx={{
                                    fontSize: 13,
                                    color: "#89768e"
                                }}
                            />

                            <TextComponent
                                value={item?.attempted_employee || "-"}
                                size={9}
                                weight={700}
                                color="#756579"
                            />
                        </Box>
                    </Tooltip>

                    <Tooltip title="Attempted at">
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.4
                            }}
                        >
                            <AccessTimeRoundedIcon
                                sx={{
                                    fontSize: 13,
                                    color: "#89768e"
                                }}
                            />

                            <TextComponent
                                value={formatDateTime(item?.attempted_at)}
                                size={9}
                                color="#756579"
                            />
                        </Box>
                    </Tooltip>
                </Box>
            </Box>
        );
    };

    if (!beds?.length) {
        return (
            <Box
                sx={{
                    minHeight: "40vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 1
                }}
            >
                <Box
                    sx={{
                        width: 65,
                        height: 65,
                        borderRadius: "18px",
                        bgcolor: "#f7edfa",
                        display: "grid",
                        placeItems: "center"
                    }}
                >
                    <BedIcon sx={{ fontSize: 34, color: "#9b1ea9" }} />
                </Box>

                <TextComponent
                    value="No Patients Found"
                    size={15}
                    weight={800}
                    color="#49314e"
                />

                <TextComponent
                    value="No patients assigned to this nursing station."
                    size={11}
                    color="#89818e"
                />

                <Button
                    size="sm"
                    variant="soft"
                    color="primary"
                    startDecorator={<RefreshIcon />}
                    onClick={Refech}
                    sx={{
                        mt: 1,
                        borderRadius: "9px",
                        fontWeight: 700
                    }}
                >
                    Refresh
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "95%",
                display: "flex",
                flexDirection: "column",
                gap: 0.8,
                pb: 2
            }}
        >
            {beds?.map((item) => {
                const admissionStatus =
                    PatientstatusConfig[item?.fb_ipc_curstatus];

                const isBlocked =
                    admissionStatus?.shortLabel !== "ADM";

                const hasPatientOrder =
                    Number(item?.patient_has_pending_order) === 1;

                const hasBystanderOrder =
                    Number(item?.bystander_has_pending_order) === 1;

                const hasOpenAttempt =
                    item?.collection_attempt_id &&
                    item?.followup_status !== "CLOSED" &&
                    item?.followup_status !== "ORDER_PLACED";

                return (
                    <Box
                        key={item?.dietpt_slno}
                        onClick={() =>
                            handlebedDetail(
                                item?.bd_code,
                                item?.fb_bdc_no,
                                item?.template_id,
                                item,
                                isBlocked,
                                admissionStatus
                            )
                        }
                        sx={{
                            position: "relative",
                            px: 1.2,
                            py: 1,
                            pl: 1.5,
                            borderRadius: "11px",
                            bgcolor: "#fff",
                            border: "1px solid",
                            borderColor: hasOpenAttempt
                                ? "#e8c78f"
                                : isBlocked
                                    ? "#f1dfc5"
                                    : "#eee7f0",
                            borderLeft: "3px solid",
                            borderLeftColor: hasOpenAttempt
                                ? "#d28b2d"
                                : isBlocked
                                    ? "#e5a044"
                                    : "#9b1ea9",
                            cursor: "pointer",
                            minWidth: 0,
                            transition: "background 0.15s ease",
                            "&:hover": {
                                bgcolor: "#fcf9fd",
                                borderColor: hasOpenAttempt
                                    ? "#d9a85f"
                                    : isBlocked
                                        ? "#e5a044"
                                        : "#c99bd0"
                            },
                            "&:active": {
                                bgcolor: "#f8f0fa"
                            }
                        }}
                    >
                        {/* Patient details */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                minWidth: 0
                            }}
                        >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <TextComponent
                                    value={item?.ptc_ptname?.trim() || "-"}
                                    size={16}
                                    weight={800}
                                    color="#302735"
                                    noWrap
                                />

                                <TextComponent
                                    value={`IP: ${item?.ip_no || "-"}`}
                                    size={10}
                                    color="#89818e"
                                />
                            </Box>

                            <Tooltip
                                title={admissionStatus?.label || "Unknown"}
                            >
                                <Chip
                                    size="sm"
                                    variant="soft"
                                    color={isBlocked ? "warning" : "success"}
                                    sx={{
                                        height: 21,
                                        fontSize: 9,
                                        fontWeight: 800,
                                        borderRadius: "6px",
                                        flexShrink: 0
                                    }}
                                >
                                    {admissionStatus?.shortLabel || "-"}
                                </Chip>
                            </Tooltip>
                        </Box>

                        {/* Bed and diet */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                mt: 0.7,
                                minWidth: 0
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.6,
                                    minWidth: 0,
                                    flex: 1
                                }}
                            >
                                <RestaurantMenuIcon
                                    sx={{
                                        fontSize: 15,
                                        color: "#9b1ea9",
                                        flexShrink: 0
                                    }}
                                />

                                <TextComponent
                                    value={item?.diet_name || "No Diet"}
                                    size={11}
                                    weight={700}
                                    color="#59465e"
                                    noWrap
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.4,
                                    flexShrink: 0
                                }}
                            >
                                <BedIcon
                                    sx={{ fontSize: 15, color: "#9b1ea9" }}
                                />

                                <TextComponent
                                    value={item?.fb_bdc_no || "-"}
                                    size={11}
                                    weight={800}
                                    color="#49314e"
                                />
                            </Box>

                            <ArrowForwardIosRoundedIcon
                                sx={{
                                    fontSize: 11,
                                    color: "#b5aab9",
                                    ml: 0.3
                                }}
                            />
                        </Box>

                        {/* Order indicators */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: { xs: 1.5, sm: 3 },
                                mt: 0.8,
                                pt: 0.7,
                                borderTop: "1px solid #f2edf3",
                                flexWrap: "wrap"
                            }}
                        >
                            <OrderIndicator
                                label="Patient"
                                hasOrder={hasPatientOrder}
                            />

                            <OrderIndicator
                                label="Bystander"
                                hasOrder={hasBystanderOrder}
                            />

                            {isBlocked && (
                                <TextComponent
                                    value="Unavailable"
                                    size={9}
                                    weight={700}
                                    color="#c17b27"
                                />
                            )}
                        </Box>

                        {/* Collection attempt details */}
                        <CollectionAttemptDetails item={item} />
                    </Box>
                );
            })}
        </Box>
    );
};

export default memo(NursingBedList);
