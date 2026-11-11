
import React, { memo, useState } from "react";
import { Box, Typography, Input, Button, Textarea } from "@mui/joy";
import { format } from "date-fns";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";

import ChooseDietType from "../../SelectComponents/ChooseDietType";
import { EmpauthId, succesNofity } from "../Constant/Constant";
import { axioslogin } from "../../Axios/axios";
import { useQueryClient } from "@tanstack/react-query";

const CreateBatch = ({ onClose, batches }) => {
    const id = EmpauthId()
    const queryClient = useQueryClient();
    const [typeId, setTypeId] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(false);
    const [typeName, setTypeName] = useState("");

    const handleCreateBatch = async () => {
        if (!typeId || !id) return;

        const now = format(new Date(), "yyyy-MM-dd HH:mm:ss");

        const existingBatch = batches?.find(
            (batch) =>
                Number(batch.type_id) === Number(typeId) &&
                batch.batch_status === "ACTIVE" &&
                batch.batch_mode === "DIRECT_DELIVERY"
        );

        if (existingBatch) {
            succesNofity(
                `An active ${typeName || "production"} batch already exists (Batch #${existingBatch.batch_id})`
            );
            return;
        }

        const payload = {
            production_date: now,
            type_id: typeId,
            remarks: remarks.trim() || null,
            batch_mode: "DIRECT_DELIVERY",
            kitchen_status: "COMPLETED",
            batch_status: "ACTIVE",
            processed_by: id,
            processed_at: now,
        };

        try {
            setLoading(true);

            const result = await axioslogin.post(
                "/productionbatch/batches/create",
                payload
            );

            if (result.data.success === 1) {
                succesNofity("Created SuccessFully");
                queryClient.invalidateQueries(["production-batch-details", id]);
                onClose();
            }
        } catch (error) {
            console.error("Create Batch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: "100dvh",
                width: "100%",
                bgcolor: "#F7F7F5",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    px: 1.8,
                    py: 1.2,
                    bgcolor: "#fff",
                    borderBottom: "1px solid #eee",
                }}
            >
                <Box
                    onClick={onClose}
                    sx={{
                        width: 34,
                        height: 34,
                        flexShrink: 0,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#f3e8ff",
                        cursor: "pointer",
                    }}
                >
                    <ArrowBackRoundedIcon
                        sx={{ color: "#9b1ea9", fontSize: 21 }}
                    />
                </Box>

                <Box>
                    <Typography fontSize={14} fontWeight={800}>
                        Create New Batch
                    </Typography>

                    <Typography fontSize={10} color="neutral.500">
                        Kitchen production management
                    </Typography>
                </Box>
            </Box>

            {/* Content */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 480,
                    mx: "auto",
                    px: 1.8,
                    py: 1.5,
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Meal Type */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography
                        fontSize={11}
                        fontWeight={800}
                        mb={0.7}
                        color="neutral.700"
                    >
                        MEAL TYPE
                    </Typography>

                    <ChooseDietType
                        value={typeId}
                        setValue={setTypeId}
                        setName={setTypeName}
                    />
                </Box>


                {/* Remarks */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography
                        fontSize={11}
                        fontWeight={800}
                        mb={0.7}
                        color="neutral.700"
                    >
                        REMARKS
                        <Typography
                            component="span"
                            fontSize={9}
                            color="neutral.400"
                            ml={0.7}
                        >
                            (OPTIONAL)
                        </Typography>
                    </Typography>

                    <Textarea
                        minRows={2}
                        maxRows={3}
                        placeholder="Enter batch remarks..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        sx={{
                            borderRadius: "12px",
                            bgcolor: "#fff",
                            fontSize: 12,
                            "--Textarea-focusedHighlight": "#9b1ea9",
                        }}
                    />
                </Box>

                {/* Preview */}
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: "14px",
                        bgcolor: "#f3e8ff",
                        mb: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                    }}
                >
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            borderRadius: "10px",
                            bgcolor: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <RestaurantRoundedIcon
                            sx={{
                                color: "#9b1ea9",
                                fontSize: 20,
                            }}
                        />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography fontSize={9} color="#777">
                            NEW PRODUCTION BATCH
                        </Typography>

                        <Typography
                            fontSize={13}
                            fontWeight={800}
                            noWrap
                        >
                            {typeName || "Select meal type"}
                        </Typography>
                    </Box>
                </Box>

                {/* Submit */}
                <Button
                    fullWidth
                    loading={loading}
                    disabled={!typeId || loading}
                    onClick={handleCreateBatch}
                    sx={{
                        minHeight: 44,
                        flexShrink: 0,
                        borderRadius: "12px",
                        bgcolor: "#9b1ea9",
                        fontSize: 12,
                        fontWeight: 800,
                        "&:hover": {
                            bgcolor: "#83168f",
                        },
                    }}
                >
                    CREATE BATCH
                </Button>
            </Box>
        </Box>
    );
};

export default memo(CreateBatch);
