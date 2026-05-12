import React, { memo, useMemo, useState } from "react";
import { useNursingStationMaster } from "../../CommonData/UseQuery";
import LoginEmployeeHeader from "../../components/LoginEmployeeHeader";
import { Box } from "@mui/joy";
import NursingStationList from "./NursingStationList";
import SearchComponent from "../../components/SearchComponent";

const Home = () => {



  const [seachVal, setSearchVal] = useState("");

  const { data: NURSING_STATIONS = [] } = useNursingStationMaster();

  const filteredStations = useMemo(() => {
    if (!seachVal) return NURSING_STATIONS;

    const search = seachVal.toLowerCase();

    return NURSING_STATIONS.filter((station) =>
      station?.fb_ns_name?.toLowerCase().includes(search)
    );
  }, [seachVal, NURSING_STATIONS]);



  return (
    <Box sx={{ width: "100%" }}>
      <LoginEmployeeHeader />
      <SearchComponent value={seachVal} onChange={setSearchVal} />
      {/*  Render Based On Tab */}
      {/* {activeTab === "home" && ( */}
      <Box
        sx={{
          width: "100%",
          mt: 8,
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          pb: 1,
        }}
      >
        <NursingStationList station={filteredStations} />
      </Box>

    </Box>
  );
};

export default memo(Home);