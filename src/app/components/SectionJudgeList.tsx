import React from "react";
import GateJudge from "./GateJudge";
import { useGates } from "../providers/GateProvider";

function SectionJudgeList() {
    const { error, loading, sections } = useGates();

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
            <h1>Loading...</h1>
        );
    }

    if (!sections.length) {
        return <div>No start list.</div>;
    }

    return (
        <div>
            {sections.map(section => (
                <>
                    <h1>[{section.bib}] {section.race}</h1>
                    {section.gates.map(gate => (
                        <GateJudge race={section.race} bib={section.bib} gateNumber={gate.gateNumber} penalty={gate.penalty} savedPenalty={gate.savedPenalty} isLocked={gate.isLocked} />
                    ))}
                </>
            ))}
        </div>
    );
}

export default SectionJudgeList;