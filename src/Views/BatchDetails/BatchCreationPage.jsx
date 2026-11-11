
import React, { memo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from "@mui/joy";

import LoginEmployeeHeader from "../../components/LoginEmployeeHeader";
import CreateBatch from "./CreateBatch";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { EmpauthId, errorNofity, succesNofity, warningNofity } from "../Constant/Constant";
import { useProductionBatchDetails } from "../../CommonData/UseQuery";
import BatchCard from "./BatchCard";
import { axioslogin } from "../../Axios/axios";

const BatchCreationPage = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [completingBatchId, setCompletingBatchId] = useState(null);

  const empId = EmpauthId();

  const {
    data: productionDetails,
    refetch: refetchProduction,
  } = useProductionBatchDetails(empId);

  const batches = Array.isArray(productionDetails)
    ? productionDetails
    : Array.isArray(productionDetails?.data)
      ? productionDetails.data
      : [];

  const activeBatches = batches.filter(
    (batch) => batch?.batch_status === "ACTIVE"
  );

  const completedBatches = batches.filter(
    (batch) => batch?.batch_status === "COMPLETED"
  );

  // Complete Batch API
  const handleCompleteBatch = async (batchId) => {
    try {
      setCompletingBatchId(batchId);

      const result = await axioslogin.post(
        `/productionbatch/batches/complete`,
        {
          batch_id: batchId,
          completed_by: empId,
        }
      );

      if (result.data.success === 1) {
        succesNofity("Batch marked as completed");
        await refetchProduction();
        setSelectedTab(1);
      } else {
        warningNofity(result.data.message || "Unable to complete batch");
      }
    } catch (error) {
      console.error("Complete Batch Error:", error);
      errorNofity("Complete Batch Error")
    } finally {
      setCompletingBatchId(null);
    }
  };

  // Create Batch Screen
  if (createOpen) {
    return (
      <CreateBatch
        batches={batches}
        onClose={() => {
          setCreateOpen(false);
          setShowCreateCard(false);
          refetchProduction();
        }}
      />
    );
  }

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
      <LoginEmployeeHeader />

      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
          mx: "auto",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Fixed Header */}
        <Box
          sx={{
            flexShrink: 0,
            px: 2,
            pt: 2.5,
            pb: 1.5,
            bgcolor: "#F7F7F5",
            zIndex: 10,
          }}
        >
          {/* Page Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: "#202020",
                }}
              >
                Production Batches
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#888",
                  mt: 0.5,
                }}
              >
                Manage kitchen production batches
              </Typography>
            </Box>

            <IconButton
              onClick={() => setShowCreateCard((prev) => !prev)}
              sx={{
                width: 38,
                height: 38,
                borderRadius: "12px",
                bgcolor: showCreateCard ? "#F5E8F7" : "#9b1ea9",
                color: showCreateCard ? "#9b1ea9" : "#fff",
                "&:hover": {
                  bgcolor: showCreateCard
                    ? "#F0DDF2"
                    : "#83168f",
                },
              }}
            >
              {showCreateCard ? (
                <CloseRoundedIcon />
              ) : (
                <AddRoundedIcon />
              )}
            </IconButton>
          </Box>

          {/* Create Batch Section */}
          {showCreateCard && (
            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: "18px",
                border: "1px solid #EEEEEE",
                p: 2,
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    bgcolor: "#F5E8F7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Inventory2RoundedIcon
                    sx={{
                      fontSize: 23,
                      color: "#9b1ea9",
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={900}
                    color="#222"
                  >
                    Create New Batch
                  </Typography>

                  <Typography
                    fontSize={10}
                    color="neutral.500"
                  >
                    Start a new kitchen production batch
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                onClick={() => setCreateOpen(true)}
                endDecorator={<ArrowForwardRoundedIcon />}
                startDecorator={<AddRoundedIcon />}
                sx={{
                  minHeight: 43,
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
          )}
        </Box>

        {/* Tabs and Batch Lists */}
        <Tabs
          value={selectedTab}
          onChange={(event, newValue) =>
            setSelectedTab(newValue)
          }
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            bgcolor: "transparent",
            overflow: "hidden",
          }}
        >
          {/* Tab Header */}
          <TabList
            disableUnderline
            sx={{
              flexShrink: 0,
              mx: 2,
              bgcolor: "#fff",
              borderRadius: "13px",
              border: "1px solid #EEEEEE",
              p: 0.5,
              gap: 0.5,
              "--ListItem-radius": "10px",
            }}
          >
            <Tab
              value={0}
              sx={{
                flex: 1,
                fontSize: 11,
                fontWeight: 800,
                color: "#777",
                "&[aria-selected='true']": {
                  bgcolor: "#FFF5E3",
                  color: "#D99020",
                },
              }}
            >
              Active ({activeBatches.length})
            </Tab>

            <Tab
              value={1}
              sx={{
                flex: 1,
                fontSize: 11,
                fontWeight: 800,
                color: "#777",
                "&[aria-selected='true']": {
                  bgcolor: "#E8F7EF",
                  color: "#269B69",
                },
              }}
            >
              Completed ({completedBatches.length})
            </Tab>
          </TabList>

          {/* Active Batches */}
          <TabPanel
            value={0}
            sx={{
              p: 0,
              pt: 1.5,
              px: 2,
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {activeBatches.length > 0 ? (
              activeBatches.map((batch) => (
                <BatchCard
                  key={batch.batch_id}
                  batch={batch}
                  onComplete={handleCompleteBatch}
                  completing={
                    completingBatchId === batch.batch_id
                  }
                />
              ))
            ) : (
              <Typography
                fontSize={11}
                color="neutral.500"
                textAlign="center"
                sx={{
                  bgcolor: "#fff",
                  border: "1px solid #EEEEEE",
                  borderRadius: "16px",
                  p: 3,
                }}
              >
                No active batches
              </Typography>
            )}
          </TabPanel>

          {/* Completed Batches */}
          <TabPanel
            value={1}
            sx={{
              p: 0,
              pt: 1.5,
              px: 2,
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {completedBatches.length > 0 ? (
              completedBatches?.map((batch) => (
                <BatchCard
                  key={batch.batch_id}
                  batch={batch}
                />
              ))
            ) : (
              <Typography
                fontSize={11}
                color="neutral.500"
                textAlign="center"
                sx={{
                  bgcolor: "#fff",
                  border: "1px solid #EEEEEE",
                  borderRadius: "16px",
                  p: 3,
                }}
              >
                No completed batches
              </Typography>
            )}
          </TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
};

export default memo(BatchCreationPage);
