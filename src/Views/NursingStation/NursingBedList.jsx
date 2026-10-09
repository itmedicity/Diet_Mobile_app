//@The Back End Has Change Means the Verify Token Has been Removed Please Change once Design Completed
import React, { memo } from "react";
import { Box, Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import TextComponent from "../../components/TextComponent";
import BedIcon from '@mui/icons-material/Bed';
import PersonIcon from '@mui/icons-material/Person';
import { PatientstatusConfig } from "../../CommonData/Common";
import { Chip, Tooltip } from "@mui/material";
import { infoNofity } from "../Constant/Constant";

const NursingBedList = ({ beds = [], stationname, Refech }) => {

    const navigate = useNavigate();


    // It Funciton to take Food Orders and we are Blocking it When the Patient Status is not ADM (Admitted)
    const handlebedDetail = (code, name, templateId, item, isBlocked, admissionstatus) => {

        if (isBlocked) return infoNofity(`The Patient ${admissionstatus?.label} have Done.`);

        navigate("/bedId", {
            state: {
                BedCode: code,
                BedName: name,
                stationname: stationname,
                template_id: templateId,
                fullDetail: item
            },
        });
    };

    // Empty State UI
    if (!beds || beds?.length === 0) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    color: "#6b6b6b",
                }}
            >
                <BedIcon sx={{ fontSize: 50, color: "#c165d1" }} />

                <TextComponent
                    value={"No Data Found"}
                    size={16}
                    weight={700}
                    color={"#4a148c"}
                />

                <TextComponent
                    value={"No patients or diet plans available"}
                    size={12}
                    weight={400}
                    color={"#7b7b7b"}
                />

                <Button
                    size="sm"
                    variant="soft"
                    onClick={() => Refech()}
                >
                    Refresh
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '90%' }}>
            {
                beds?.map((item, index) => {

                    const AdmissiongStatus = PatientstatusConfig[item?.fb_ipc_curstatus];

                    const isBlocked = AdmissiongStatus?.shortLabel !== 'ADM';

                    return (
                        <Box
                            key={index}
                            onClick={() =>
                                handlebedDetail(
                                    item?.bd_code,
                                    item?.fb_bdc_no,
                                    item?.template_id,
                                    item,
                                    isBlocked,
                                    AdmissiongStatus
                                )
                            }
                            sx={{
                                width: "100%",
                                boxSizing: "border-box",
                                borderRadius: 5,
                                boxShadow: "md",
                                mb: 1,
                                height: 50,
                                bgcolor: "rgb(252, 248, 254)",
                                cursor: "pointer",

                                border: isBlocked
                                    ? "1px solid rgb(237, 141, 8)"
                                    : "1px solid rgb(177, 38, 236)",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 1,

                                ...(isBlocked && {
                                    animation: "blockedPulse 1.5s ease-in-out infinite",

                                    "@keyframes blockedPulse": {
                                        "0%": {
                                            boxShadow: "0 0 0 0 rgba(249, 6, 6, 0.45)",
                                        },
                                        "70%": {
                                            boxShadow: "0 0 0 6px rgba(249, 6, 6, 0)",
                                        },
                                        "100%": {
                                            boxShadow: "0 0 0 0 rgba(249, 6, 6, 0)",
                                        },
                                    },
                                }),
                            }}
                        >

                            <Box sx={{ width: '50%', display: 'flex', alignItems: 'start', gap: 1 }}>
                                <PersonIcon sx={{ color: '#9b9999', fontSize: 17 }} />
                                <Box sx={{ width: '100%' }}>
                                    <TextComponent
                                        noWrap
                                        color={'#000000'}
                                        value={item?.ptc_ptname}
                                        size={10}
                                        weight={800}
                                    />
                                    <TextComponent
                                        color={'#727070'}
                                        value={item?.ip_no}
                                        size={10}
                                        weight={400}
                                    />
                                </Box>
                            </Box>


                            <Box sx={{ width: '20%', display: 'flex', alignItems: 'start' }}>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={0.5}
                                    sx={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Tooltip title={AdmissiongStatus?.label}
                                        placement='left-start'>
                                        <Chip
                                            icon={AdmissiongStatus?.icon && (
                                                React.cloneElement(AdmissiongStatus.icon, {
                                                    size: 14,
                                                    color: AdmissiongStatus?.color,
                                                })
                                            )}
                                            label={AdmissiongStatus?.shortLabel || "-"}
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
                                    </Tooltip>

                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    width: "30%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                        width: "100%",
                                    }}
                                >
                                    <BedIcon
                                        sx={{
                                            fontSize: 16,
                                            color: "#726d74",
                                        }}
                                    />

                                    <TextComponent
                                        color="#000000"
                                        value={item?.fb_bdc_no}
                                        size={13}
                                        weight={800}
                                    />
                                </Box>

                                <TextComponent
                                    color="#000000"
                                    value={item?.diet_name}
                                    size={9}
                                    weight={800}
                                />
                            </Box>
                        </Box>
                    )
                })
            }
        </Box>
    );
};

export default memo(NursingBedList);