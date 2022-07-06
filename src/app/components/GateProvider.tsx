import React, { createContext, useState, useContext } from "react";
//import colorData from "./color-data.json";
import { v4 } from "uuid";
import Sheetdata from "../../api/penaltydata";
import { useGetSheetData } from '../hooks';
import { GASClient } from 'gas-client';
import Penalties from "../../api/penaltydata";
import { AppConfig } from "../../api/AppConfig";
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
export default function GateProvider({ children, appConfigString }) {
    const appConfig:AppConfig = JSON.parse(appConfigString);
    const sheetName = appConfig.sheetName;
    const beginGate = appConfig.beginGate;
    const gateLength = appConfig.gateLength;
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
                : section
        );
        setSections(modified);

        const newSections = modified.filter(section => (section.race === race) && (section.bib === bib));
        if (newSections.length === 1) {
            const section = newSections[0];
            const gates = section.gates.filter(gate => (gate.gateNumber === gateNumber));
            if (gates.length === 1) {
                const gate = gates[0];
                const sheetData = {
                    sections: [{ ...section, gates: [{ ...gate }] }],
                }
                serverFunctions.putData(sheetName, sheetData)
                    .then((saved: Sheetdata.SheetData) => {
                        setSections(sections => {
                            const savedSection = saved.sections[0];
                            const race = savedSection.race;
                            const bib = savedSection.bib;
                            const gate = savedSection.gates[0];
                            const gateNumber = gate.gateNumber;
                            const savedPenalty = gate.savedPenalty;
                            const isLocked = gate.isLocked;
                            const updateSectionGatePenalty = (section: Sheetdata.section) => {
                                const gates = section.gates.map(gate =>
                                    gate.gateNumber === gateNumber
                                        ? { ...gate, penalty: savedPenalty, savedPenalty, isLocked }
                                        : gate
                                );
                                return { ...section, gates };
                            };
                            const modified = sections.map(section =>
                                (section.race === race) && (section.bib === bib)
                                    ? updateSectionGatePenalty(section)
                                    : section
                            );
                            return modified;
                        });
                    });
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
