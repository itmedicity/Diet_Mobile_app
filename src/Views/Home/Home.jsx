import React, { memo, useMemo, useState } from "react";
import { useNursingStationMaster } from "../../CommonData/UseQuery";
import LoginEmployeeHeader from "../../components/LoginEmployeeHeader";
import { Box } from "@mui/joy";
import NursingStationList from "./NursingStationList";
import SearchComponent from "../../components/SearchComponent";
import { COLORS, FONT } from "../../Style/designTokens";

const Home = () => {

  const [seachVal, setSearchVal] = useState("");

  const { data: NURSING_STATIONS = [] } = useNursingStationMaster();

  // the master table can hold a station code twice: show each station once
  const uniqueStations = useMemo(() => {
    const seen = new Set();
    return NURSING_STATIONS.filter((station) => {
      if (seen.has(station?.fb_ns_code)) return false;
      seen.add(station?.fb_ns_code);
      return true;
    });
  }, [NURSING_STATIONS]);

  const filteredStations = useMemo(() => {
    if (!seachVal) return uniqueStations;

    const search = seachVal.toLowerCase();

    return uniqueStations.filter((station) =>
      station?.fb_ns_name?.toLowerCase().includes(search)
    );
  }, [seachVal, uniqueStations]);

  return (
    <Box sx={{ width: "100%", minHeight: "100dvh", bgcolor: COLORS.white }}>
      <LoginEmployeeHeader />
      <SearchComponent value={seachVal} onChange={setSearchVal} placeholder="Search nursing station" />

      <Box sx={{ width: "100%", maxWidth: 560, mx: "auto", mt: 8, pb: 3 }}>
        <Box sx={{ px: 2.5, pt: 2.5, pb: 1, fontFamily: FONT }}>
          <Box component="h1" sx={{ m: 0, fontSize: 22, fontWeight: 700, color: COLORS.ink, letterSpacing: "-0.01em" }}>
            Choose a nursing station
          </Box>
          <Box sx={{ mt: 0.5, fontSize: 14, color: COLORS.muted }}>
            {filteredStations.length} {filteredStations.length === 1 ? "station" : "stations"}
          </Box>
        </Box>

        <NursingStationList station={filteredStations} searching={!!seachVal} />
      </Box>
    </Box>
  );
};

export default memo(Home);
