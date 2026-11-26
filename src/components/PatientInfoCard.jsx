
import { Avatar, Box, IconButton, Tooltip } from '@mui/joy';
import TextComponent from './TextComponent';
import React, { memo } from 'react';
import { PatientstatusConfig } from '../CommonData/Common';
import { Chip } from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

const PatientInfoCard = ({
    PatientDetail,
    onReportFailure
}) => {

    const getInitial = (name) => {
        if (!name) return "";
        return name.trim().charAt(0).toUpperCase();
    };

    const AdmissiongStatus =
        PatientstatusConfig[PatientDetail?.fb_ipc_curstatus];

    return (
        <Box
            sx={{
                width: "100%",
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: 'center',
                mt: 2
            }}
        >
            <Box
                sx={{
                    width: '90%',
                    bgcolor: '#ffffff',
                    boxShadow: "sm",
                    height: '90%',
                    borderRadius: 5,
                    p: 1,
                    display: "flex",
                    gap: 1,
                    borderLeft: "2px solid #9d25b8",
                    borderRight: '2px solid #9d25b8',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >

                {/* PATIENT DETAILS */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    minWidth: 0
                }}>
                    <Avatar
                        sx={{
                            bgcolor: "#9d25b8",
                            width: 35,
                            height: 35,
                            fontWeight: 600,
                            color: 'white',
                            flexShrink: 0
                        }}
                    >
                        {getInitial(PatientDetail?.ptc_ptname)}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                        <TextComponent
                            value={PatientDetail?.ptc_ptname}
                            color='black'
                            size={12}
                            weight={800}
                        />
                        <TextComponent
                            value={PatientDetail?.pt_no}
                            color='black'
                            size={10}
                            weight={600}
                        />
                    </Box>
                </Box>

                {/* ACTIONS */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        flexShrink: 0
                    }}
                >
                    {onReportFailure && (
                        <Tooltip title="Report collection failure">
                            <IconButton
                                size="sm"
                                variant="soft"
                                color="warning"
                                onClick={onReportFailure}
                                sx={{
                                    borderRadius: "8px",
                                    width: 29,
                                    height: 29
                                }}
                            >
                                <ReportProblemOutlinedIcon
                                    sx={{ fontSize: 17 }}
                                />
                            </IconButton>
                        </Tooltip>
                    )}

                    <Chip
                        icon={AdmissiongStatus?.icon && (
                            React.cloneElement(AdmissiongStatus.icon, {
                                size: 14,
                                color: AdmissiongStatus?.color,
                            })
                        )}
                        label={AdmissiongStatus?.label || "-"}
                        size="small"
                        sx={{
                            height: 24,
                            borderRadius: "6px",
                            fontSize: 10,
                            fontWeight: 800,
                            backgroundColor:
                                AdmissiongStatus?.bgColor ||
                                "rgba(37, 99, 235, 0.08)",
                            color: AdmissiongStatus?.color || "inherit",
                            border: `1px solid ${AdmissiongStatus?.borderColor || "transparent"
                                }`,
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default memo(PatientInfoCard);
