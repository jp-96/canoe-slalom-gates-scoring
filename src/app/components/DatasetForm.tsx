import React from "react";
import CanoeSlalomHeatData from "../../dao/CanoeSlalomHeatData";
import { useData } from "../providers/CanoeSlalomHeatDataProvider";
import DatasetGateJudge from "./DatasetGateJudge";
import Logo from './Logo';

export default function DatasetForm() {
    const { error, loading, dataset } = useData();

    if (error) {
        return (
            <>
                <Logo className="App-logo-error" />
                <h1>Error</h1>
                <code>{JSON.stringify(error, null, 2)}</code>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Logo className="App-logo" />
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
