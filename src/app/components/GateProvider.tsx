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
    const sheetName = 'テストデータ';
    const { loading, error, sections, setSections } = useGetSheetData(sheetName);
    const setPenalty = (race: string, bib: number, gateNumber: number, newPenalty: string) => {
        const setSection = (section) => (
            section.map(gate =>
                gate.gateNumber === gateNumber
                    ? { ...gate, newPenalty }
                    : gate
            )
        );
        setSections(
            sections.map(section =>
                (section.race === race) && (section.bib === bib)
                    ? setSection(section)
                    : section)
        );
        
        const orgSections = sections.filter(section => (section.race === race) && (section.bib === bib));
        if (orgSections.length === 1) {
            const orgGates = orgSections[0].gates.filter(gate => (gate.gateNumber === gateNumber));
            if (orgGates.length === 1) {
                const isLocked = orgGates[0].isLocked;
                orgSections[0].gates = [
                    {
                        ...orgGates[0], 
                        penalty: newPenalty,
                    }
                ];
                const sheetData = {
                    sections: orgSections,
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
