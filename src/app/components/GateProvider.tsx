import React, { createContext, useState, useContext } from "react";
//import colorData from "./color-data.json";
import { v4 } from "uuid";
import Sheetdata from "../../api/penaltydata";
import { useGetSheetData } from '../hooks';
import { GASClient } from 'gas-client';
import Penalties from "../../api/penaltydata";
const { serverFunctions } = new GASClient();

type GateContextType = {
    sections: Sheetdata.section[];
    setPenalty: (race: string, bib: number, gateNumber: number, newPenalty: string) => void;
};

const GateContext = createContext<GateContextType>({
    sections: [],
    setPenalty: (race, bib, gateNumber, newPenalty) => undefined,
});

export const useGates = () => useContext(GateContext);
export default function GateProvider({ children }) {
    const p = JSON.parse('{"sheetName": "<?= sheetName ?>", "beginGate": <?= beginGate ?>, "gateLength": <?= gateLength ?>}');
    const sheetName = p.sheetName;
    const beginGate = p.beginGate;
    const gateLength = p.gateLength;
    const { loading, error, sections, setSections } = useGetSheetData(sheetName, beginGate, gateLength);
    const setPenalty = (race: string, bib: number, gateNumber: number, penalty: string) => {
        const updateSectionGatePenalty = (section: Sheetdata.section) => {
            const gates = section.gates.map(gate =>
                gate.gateNumber === gateNumber
                    ? { ...gate, penalty }
                    : gate
            );
            return { ...section, gates };
        };
        const modified = sections.map(section =>
            (section.race === race) && (section.bib === bib)
                ? updateSectionGatePenalty(section)
                : section)
        setSections(
            modified
        );
        
        const newSections = modified.filter(section => (section.race === race) && (section.bib === bib));
        if (newSections.length === 1) {
            const section = newSections[0];
            const gates = section.gates.filter(gate => (gate.gateNumber === gateNumber));
            if (gates.length === 1) {
                const gate = gates[0];
                const sheetData = {
                    sections: [{ ...section, gates: [{ ...gate }] }],
                }
                serverFunctions.putData(sheetName, sheetData);
            }
        }
        
    };

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

    return (
        <GateContext.Provider value={{ sections, setPenalty }}>
            {children}
        </GateContext.Provider>
    );

}
