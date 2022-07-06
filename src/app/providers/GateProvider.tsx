import React, { createContext, useContext, useState, useEffect } from "react";
import { useAppConfig } from "./AppConfigProvider";
import Sheetdata from "../../api/penaltydata";
import { GASClient } from 'gas-client';
const { serverFunctions } = new GASClient();

const useGetSheetData = (sheetName: string, beginGate: number, gateLength: number): { loading: boolean, error: any, sections: Sheetdata.section[], setSections: React.Dispatch<React.SetStateAction<Sheetdata.section[]>> } => {
    const emptySections: Sheetdata.section[] = [];
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [sections, setSections] = useState(emptySections);

    useEffect(() => {
        serverFunctions.getData(sheetName, beginGate, gateLength)
            .then(sheetData => setSections(sheetData.sections))
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return {
        loading, error, sections, setSections,
    }
}

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
    const { appConfig } = useAppConfig();
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
