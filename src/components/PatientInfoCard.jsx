import { Box } from '@mui/joy'
import React, { memo } from 'react'
import { PatientstatusConfig } from '../CommonData/Common';
import { COLORS, FONT } from '../Style/designTokens';

const PatientInfoCard = ({ PatientDetail }) => {

    //  Get first letter safely
    const getInitial = (name) => {
        if (!name) return "";
        return name.trim().charAt(0).toUpperCase();
    };

    const AdmissiongStatus = PatientstatusConfig[PatientDetail?.fb_ipc_curstatus];

    return (
        <Box
            sx={{
                mt: 1.5, p: 1.5, borderRadius: "16px", fontFamily: FONT,
                bgcolor: COLORS.surface, border: `1px solid ${COLORS.line}`,
                display: "flex", alignItems: "center", gap: 1.5,
            }}
        >
            <Box
                aria-hidden="true"
                sx={{
                    flexShrink: 0, width: 44, height: 44, borderRadius: "50%", display: "grid", placeItems: "center",
                    bgcolor: COLORS.plum, color: COLORS.white, fontSize: 18, fontWeight: 700,
                }}
            >
                {getInitial(PatientDetail?.ptc_ptname)}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {PatientDetail?.ptc_ptname}
                </Box>
                <Box sx={{ mt: 0.25, fontSize: 13, color: COLORS.muted }}>
                    {PatientDetail?.pt_no}
                </Box>
            </Box>

            <Box
                component="span"
                sx={{
                    flexShrink: 0, px: 1, py: 0.5, borderRadius: "8px", fontSize: 13, fontWeight: 700,
                    bgcolor: AdmissiongStatus?.bgColor || COLORS.wash,
                    color: AdmissiongStatus?.color || COLORS.plum,
                    border: `1px solid ${AdmissiongStatus?.borderColor || COLORS.line}`,
                }}
            >
                {AdmissiongStatus?.label || "-"}
            </Box>
        </Box>
    )
}

export default memo(PatientInfoCard)
