import React from "react";
import Penalties from "../../api/penaltydata";

function SectionJudge({ race, bib, isLocked, gates }) {
    return (
        <section>
            <h1>{bib} - {race}</h1>
            {gates.map((gate: Penalties.gate) =>
                <h2>gateNumber:{gate.gateNumber}</h2>
            )}
        </section>
    );
}

export default SectionJudge;