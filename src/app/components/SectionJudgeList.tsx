import React from "react";
import GateJudge from "./GateJudge";
import { useGates } from "./GateProvider";

function SectionJudgeList() {
    const { sections, setPenalty } = useGates();

    if (!sections.length) return <div>No start list.</div>;

    return (
        <div>
            {sections.map(section => (
                <>
                    <h1>[{section.bib}] {section.race}</h1>
                    {section.gates.map(gate => (
                        <GateJudge gateNumber={gate.gateNumber} gateColor={gate.isLocked ? "red" : "green"} defaultPenalty={gate.penalty}/>
                    ))}
                </>
            ))}
        </div>
    );
}

export default SectionJudgeList;