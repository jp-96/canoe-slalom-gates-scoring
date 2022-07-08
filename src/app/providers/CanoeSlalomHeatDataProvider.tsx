import React, { createContext, useContext } from 'react';
import CanoeSlalomHeatData from '../../dao/CanoeSlalomHeatData';

// ToDo: immer
// https://immerjs.github.io/immer/example-setstate#useimmerreducer

type CanoeSlalomHeatDataContextType = {
    dataset: CanoeSlalomHeatData.Dataset;
};

const CanoeSlalomHeatDataContext = createContext<CanoeSlalomHeatDataContextType>({
    dataset: {sheetName: ''},
});

export const useGates = () => useContext(CanoeSlalomHeatDataContext);
export default function GateProvider({ children }) {
    const dataset = {sheetName:''};
    return (
        <CanoeSlalomHeatDataContext.Provider value={{dataset}}>
            {children}
        </CanoeSlalomHeatDataContext.Provider>
    );
}
