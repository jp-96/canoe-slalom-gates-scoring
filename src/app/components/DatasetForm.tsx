import React from "react";
import { useData } from "../providers/CanoeSlalomHeatDataProvider";
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

    return (
        <div>
            <p>{dataset.sheetName}</p>
            {dataset.runs.map(run => (
                <>
                    <h1>[{run.runner.bib}] {run.runner.heat}</h1>
                    <p>ゲート数：{run.gates ? run.gates.length : 'None'}</p>
                </>
            ))}
        </div>
    );
}
