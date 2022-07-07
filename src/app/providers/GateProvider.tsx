import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParameter } from './HtmlTemplateParameterProvider';
import AppConfig from '../../api/AppConfig';
import Sheetdata from '../../api/penaltydata';
import { GASClient } from 'gas-client';
const { serverFunctions } = new GASClient();

const useGetSheetData = (sheetName: string, beginGate: number, gateLength: number) => {
    const emptySections: Sheetdata.section[] = [];
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState(emptySections);

    useEffect(() => {
        serverFunctions.getData(sheetName, beginGate, gateLength)
            .then(sheetData => setSections(sheetData.sections))
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return {
        error, loading, sections, setSections,
    }
}

type GateContextType = {
    error?: any;
    loading: boolean;
    sections: Sheetdata.section[];
    setPenalty: (race: string, bib: number, gateNumber: number, newPenalty: string) => void;
};

const GateContext = createContext<GateContextType>({
    error: { name: 'GateContext.Provider is nothing.', },
    loading: false,
    sections: [],
    setPenalty: (race, bib, gateNumber, newPenalty) => undefined,
});

export const useGates = () => useContext(GateContext);
export default function GateProvider({ children }) {
    const { parameter } = useParameter(AppConfig.defaultValue);
    const sheetName = parameter.sheetName;
    const beginGate = parameter.beginGate;
    const gateLength = parameter.gateLength;
    const { error, loading, sections, setSections } = useGetSheetData(sheetName, beginGate, gateLength);
    const setPenalty = (race: string, bib: number, gateNumber: number, newPenalty: string) => {
        const updateSectionGatePenalty = (section: Sheetdata.section) => {
            const gates = section.gates.map(gate =>
                gate.gateNumber === gateNumber
                    ? { ...gate, penalty: newPenalty, fetchStatus: { isLoading: true } }
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
                    sheetName,
                    sections: [{ ...section, gates: [{ ...gate }] }],
                }
                serverFunctions.putData(sheetData)
                    .then((saved: Sheetdata.SheetData) => {
                        setSections(sections => {
                            const savedSection = saved.sections[0];
                            const savedGate = savedSection.gates[0];
                            const updateSectionGatePenalty = (section: Sheetdata.section) => {
                                const gates = section.gates.map(gate =>
                                    gate.gateNumber === gateNumber
                                        ? { ...gate, penalty: savedGate.penalty, isLocked: savedGate.isLocked, fetchStatus: {} }
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
                    })
                    .catch(e => {
                        setSections(sections => {
                            const updateSectionGatePenalty = (section: Sheetdata.section) => {
                                const gates = section.gates.map(gate =>
                                    gate.gateNumber === gateNumber
                                        ? { ...gate, fetchStatus: { isError: true } }
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

    return (
        <GateContext.Provider value={{ error, loading, sections, setPenalty }}>
            {children}
        </GateContext.Provider>
    );

}
