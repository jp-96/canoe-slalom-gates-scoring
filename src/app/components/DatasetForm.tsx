import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Virtuoso } from 'react-virtuoso'
import MuiTimeInput from "./MuiTimeInput";
import MuiGateJudgeButton from "./MuiGateJudgeButton";
import CanoeSlalomHeatData from "../../dao/CanoeSlalomHeatData";
import { useData } from "../providers/CanoeSlalomHeatDataProvider";

export default function DatasetForm() {
    const { error, loading, dataset } = useData();

    if ((error) && (dataset.runs.length === 0)) {
        return (
            <>
                <h1>Error</h1>
                <code>{JSON.stringify(error, null, 2)}</code>
            </>
        );
    }

    if ((loading) && (dataset.runs.length === 0)) {
        return (
            <>
                <h1>Loading...</h1>
            </>
        );
    }

    if (!dataset.runs.length) {
        return <div>No list.</div>;
    }

    const startedTimes = (v: CanoeSlalomHeatData.startedTime | undefined) => {
        if (v) {
            return [v];
        } else {
            return [];
        }
    }

    const getes = (v: CanoeSlalomHeatData.gate[] | undefined) => {
        if (v) {
            return v;
        } else {
            return [];
        }
    };

    const finishedTimes = (v: CanoeSlalomHeatData.finishedTime | undefined) => {
        if (v) {
            return [v];
        } else {
            return [];
        }
    }

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
                        <h1>[{run.runner.bib}] {run.runner.tag}</h1>
                        {startedTimes(run.started).map(time => {
                            return <MuiTimeInput key={`${run.runner.row}-START`}
                                row={run.runner.row} startOrFinish={'START'}
                                seconds={time.seconds} judge={time.judge}
                                isError={time.fetching.hasError} isFailure={time.fetching.isFailure}
                                isLoading={time.fetching.isLoading} isLocked={time.isLocked} />
                        })}
                        {getes(run.gates).map(gate => {
                            const isLocked = (gate.isLocked || (gate.direction === 'FREE'));
                            const isDownStream = (gate.direction !== 'UP');
                            return (
                                <MuiGateJudgeButton
                                    key={`${run.runner.row}-${gate.num}`}
                                    row={run.runner.row} num={gate.num} isDownStream={isDownStream}
                                    judge={gate.judge}
                                    isError={gate.fetching.hasError} isFailure={gate.fetching.isFailure}
                                    isLoading={gate.fetching.isLoading} isLocked={isLocked}
                                />
                            );
                        })}
                        {finishedTimes(run.finished).map(time => {
                            return <MuiTimeInput key={`${run.runner.row}-FINISH`}
                                row={run.runner.row} startOrFinish={'FINISH'}
                                seconds={time.seconds} judge={time.judge}
                                isError={time.fetching.hasError} isFailure={time.fetching.isFailure}
                                isLoading={time.fetching.isLoading} isLocked={time.isLocked} />
                        })}
                    </Stack>
                </Box>
            )}
        />
    );
}