
import React, { memo, useMemo } from "react";
import { Box, Chip, Typography } from "@mui/joy";

const NursingStationFilter = ({
    stations = [],
    bills = [],
    selectedStation,
    onStationChange,
}) => {
    const stationOptions = useMemo(() => {
        const billCounts = bills.reduce((acc, bill) => {
            const code = bill?.nurse_station_code;

            if (code) {
                acc[code] = (acc[code] || 0) + 1;
            }

            return acc;
        }, {});

        return [
            {
                code: "ALL",
                name: "All Stations",
                count: bills.length,
            },
            ...stations
                .filter((station) => station?.fb_ns_status === 1)
                .map((station) => ({
                    code: station.fb_ns_code,
                    name: station.fb_ns_name,
                    count: billCounts[station.fb_ns_code] || 0,
                }))
                .filter((station) => station.count > 0),
        ];
    }, [stations, bills]);

    return (
        <Box
            sx={{
                mt: 1.2,
                mb: 1.2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.8,
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "Bahnschrift",
                        fontSize: "0.68rem",
                        fontWeight: 900,
                        color: "#555550",
                    }}
                >
                    NURSING STATIONS
                </Typography>

                <Typography
                    sx={{
                        fontFamily: "Bahnschrift",
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        color: "#92928B",
                    }}
                >
                    {stationOptions.length - 1} stations
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 0.7,
                    overflowX: "auto",
                    pb: 0.5,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                {stationOptions.map((station) => {
                    const selected =
                        selectedStation === station.code;

                    return (
                        <Chip
                            key={station.code}
                            onClick={() =>
                                onStationChange(station.code)
                            }
                            variant={selected ? "solid" : "outlined"}
                            sx={{
                                flexShrink: 0,
                                height: 32,
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontFamily: "Bahnschrift",
                                fontSize: "0.68rem",
                                fontWeight: 800,
                                bgcolor: selected
                                    ? "#3730A3"
                                    : "#FFFFFF",
                                color: selected
                                    ? "#FFFFFF"
                                    : "#555550",
                                borderColor: selected
                                    ? "#3730A3"
                                    : "#E2E2DD",
                                "&:hover": {
                                    bgcolor: selected
                                        ? "#312E81"
                                        : "#F1F0FF",
                                },
                            }}
                        >
                            {station.name} ({station.count})
                        </Chip>
                    );
                })}
            </Box>
        </Box>
    );
};

export default memo(NursingStationFilter);
