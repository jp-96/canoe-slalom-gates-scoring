import React from "react";
import CanoeSlalomHeatData from "../../dao/CanoeSlalomHeatData";
import { useData } from "../providers/CanoeSlalomHeatDataProvider";
import DatasetGateJudge from "./DatasetGateJudge";

export default function DatasetForm() {
    const { error, loading, dataset } = useData();

    if (error) {
        return (
            <>
                <h1>Error</h1>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <h1>Loading...</h1>
                <p>dataset</p>
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
        <>
            <p>{dataset.sheetName}</p>
            <div>
                {dataset.runs.map(run => (
                    <>
                        <h1>[{run.runner.bib}] {run.runner.heat}</h1>
                        {getes(run.gates).map(gate => (
                            <DatasetGateJudge
                                key={`${run.runner.row}-${gate.num}`}
                                row={run.runner.row} num={gate.num} judge={gate.judge}
                                isError={gate.fetching.hasError} isFailure={gate.fetching.isFailure}
                                isLoading={gate.fetching.isLoading} isLocked={gate.isLocked}
                            />
                        ))}
                    </>
                ))}
            </div>
        </>
    );
}
