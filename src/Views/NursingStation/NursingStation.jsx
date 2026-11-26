
import React, { memo, useMemo, useState } from 'react'
import { Box } from '@mui/joy';
import NursingStaionHeader from './NursingStaionHeader';
import { useLocation } from 'react-router-dom';
import { useAllPatientDietPlan } from '../../CommonData/UseQuery';
import NursingBedList from './NursingBedList';
import SearchComponent from '../../components/SearchComponent';
import NursingBedListSkeleton from './Component/NursingBedListSkeleton';


const NursingStation = () => {
    const location = useLocation();
    const { nsCode, nsName } = location.state || {};
    const [seachVal, setSearchVal] = useState("");

    const {
        data: allPatientDiet = [],
        refetch: FetchPatientDietPlan,
        isLoading
    } = useAllPatientDietPlan(nsCode);



    // Filter based on search value (bed + patient name)
    const filteredBedDetail = useMemo(() => {
        if (!seachVal) return allPatientDiet;

        const search = seachVal.toLowerCase();

        return allPatientDiet?.filter((bed) =>
            bed?.fb_bdc_no?.toLowerCase().includes(search) ||   // bed number
            bed?.ptc_ptname?.toLowerCase().includes(search)     // patient name
        );
    }, [seachVal, allPatientDiet]);


    return (
        <Box sx={{ width: '100%' }}>
            <NursingStaionHeader stationname={nsName} />
            <SearchComponent value={seachVal} onChange={setSearchVal} />
            <Box
                sx={{
                    width: "100%",
                    mt: 8,
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    // p: 2
                }}>
                {isLoading ? (
                    <NursingBedListSkeleton count={6} />
                ) : (
                    <NursingBedList
                        beds={filteredBedDetail}
                        Refech={FetchPatientDietPlan}
                        stationname={nsName}
                        isLoading={isLoading}
                    />
                )}

            </Box>
        </Box>
    )
}

export default memo(NursingStation);