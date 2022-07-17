import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Virtuoso } from 'react-virtuoso'
import MuiGateJudgeButton from "./MuiGateJudgeButton";
import CanoeSlalomHeatData from "../../dao/CanoeSlalomHeatData";
import { useData } from "../providers/CanoeSlalomHeatDataProvider";

export default function DatasetForm() {
    const { error, loading, dataset } = useData();

    if (error) {
        return (
            <>
                <h1>Error</h1>
                <code>{JSON.stringify(error, null, 2)}</code>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <h1>Loading...</h1>
            </>
        );
    }

    if (!dataset.runs.length) {
        return <div>No list.</div>;
    }

    const getes = (v: CanoeSlalomHeatData.gate[] | undefined) => {
        if (v) {
            return v;
        } else {
            return [];
        }
    };

    return (
        <Virtuoso
            className="AppContent"
            data={dataset.runs}
            itemContent={(index, run) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    textAlign="center">
                    <Stack direction="column" spacing={1}>
                        <h1>[{run.runner.bib}] {run.runner.heat}</h1>
                        {getes(run.gates).map(gate => (
                            <MuiGateJudgeButton
                                key={`${run.runner.row}-${gate.num}`}
                                row={run.runner.row} num={gate.num} judge={gate.judge}
                                isError={gate.fetching.hasError} isFailure={gate.fetching.isFailure}
                                isLoading={gate.fetching.isLoading} isLocked={gate.isLocked}
                            />
                        ))}
                    </Stack>
                </Box>
            )}
        />
    );
}