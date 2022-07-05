import React from "react";
import GateJudge from "./GateJudge";
import { useGates } from "./GateProvider";

function SectionJudgeList() {
    const { sections } = useGates();

    if (!sections.length) return <div>No start list.</div>;

    return (
        <div>
            {sections.map(section => (
                <>
                    <h1>[{section.bib}] {section.race}</h1>
                    {section.gates.map(gate => (
                        <GateJudge race={section.race} bib={section.bib} gateNumber={gate.gateNumber} penalty={gate.penalty} isLocked={gate.isLocked} />
                    ))}
                </>
            ))}
        </div>
    );
}

export default SectionJudgeList;