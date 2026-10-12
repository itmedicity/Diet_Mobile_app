//@The Back End Has Change Means the Verify Token Has been Removed Please Change once Design Completed
import React, { memo } from "react";
import { Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import BedIcon from '@mui/icons-material/Bed';
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { PatientstatusConfig } from "../../CommonData/Common";
import { infoNofity } from "../Constant/Constant";
import { COLORS, FONT, focusRing } from "../../Style/designTokens";

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
                    width: "100%", px: 3, py: 8, boxSizing: "border-box", fontFamily: FONT,
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1,
                }}
            >
                <BedIcon aria-hidden="true" sx={{ fontSize: 40, color: COLORS.orchid }} />
                <Box component="h2" sx={{ m: 0, fontSize: 20, fontWeight: 700, color: COLORS.ink }}>
                    No patients to show
                </Box>
                <Box sx={{ fontSize: 15, lineHeight: 1.5, color: COLORS.muted }}>
                    This station has no admitted patients with a diet plan right now, or none match your search.
                </Box>
                <Box
                    component="button"
                    type="button"
                    onClick={() => Refech?.()}
                    sx={{
                        mt: 1, height: 44, px: 2.5, borderRadius: "12px", cursor: "pointer",
                        border: `1.5px solid ${COLORS.plum}`, bgcolor: COLORS.white, color: COLORS.plum,
                        fontFamily: FONT, fontSize: 16, fontWeight: 700,
                        ...focusRing,
                    }}
                >
                    Refresh
                </Box>
            </Box>
        );
    }

    return (
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, width: "100%", fontFamily: FONT }}>
            {
                beds?.map((item, index) => {

                    const AdmissiongStatus = PatientstatusConfig[item?.fb_ipc_curstatus];

                    const isBlocked = AdmissiongStatus?.shortLabel !== 'ADM';

                    return (
                        <Box
                            component="li"
                            key={`${item?.bd_code}-${item?.ip_no}-${index}`}
                            sx={{ borderBottom: `1px solid ${COLORS.line}` }}
                        >
                            <Box
                                component="button"
                                type="button"
                                aria-disabled={isBlocked}
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
                                    width: "100%", minHeight: 68, px: 2.5, py: 1.25, border: 0, bgcolor: "transparent",
                                    display: "flex", alignItems: "center", gap: 1.5, textAlign: "left", cursor: "pointer",
                                    fontFamily: FONT, color: COLORS.ink,
                                    opacity: isBlocked ? 0.62 : 1,
                                    "&:active": { bgcolor: COLORS.wash },
                                    ...focusRing,
                                }}
                            >
                                {/* bed number */}
                                <Box
                                    sx={{
                                        flexShrink: 0, minWidth: 56, height: 44, px: 1, borderRadius: "10px", boxSizing: "border-box",
                                        display: "grid", placeItems: "center",
                                        bgcolor: COLORS.wash, color: COLORS.plum, fontSize: 16, fontWeight: 700,
                                    }}
                                >
                                    {item?.fb_bdc_no}
                                </Box>

                                {/* patient */}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {item?.ptc_ptname}
                                    </Box>
                                    <Box sx={{ mt: 0.25, fontSize: 13, color: COLORS.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {item?.ip_no}{item?.diet_name ? `  ·  ${item.diet_name}` : ""}
                                    </Box>
                                </Box>

                                {/* only a patient who is no longer admitted needs a tag: it says why the row is dimmed */}
                                {isBlocked ? (
                                    <Box
                                        component="span"
                                        sx={{
                                            flexShrink: 0, px: 1, py: 0.25, borderRadius: "8px", fontSize: 12, fontWeight: 700,
                                            bgcolor: AdmissiongStatus?.bgColor || COLORS.surface,
                                            color: AdmissiongStatus?.color || COLORS.muted,
                                            border: `1px solid ${AdmissiongStatus?.borderColor || COLORS.line}`,
                                        }}
                                    >
                                        {AdmissiongStatus?.shortLabel || "-"}
                                    </Box>
                                ) : (
                                    <ChevronRightRoundedIcon aria-hidden="true" sx={{ flexShrink: 0, color: COLORS.muted }} />
                                )}
                            </Box>
                        </Box>
                    )
                })
            }
        </Box>
    );
};

export default memo(NursingBedList);
