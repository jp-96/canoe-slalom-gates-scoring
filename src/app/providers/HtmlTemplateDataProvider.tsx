import React, { createContext, useContext } from 'react';
import HtmlTemplateDataSetter from '../../api/HtmlTemplateDataSetter';

const HtmlTemplateDataContext = createContext(HtmlTemplateDataSetter.defaultValue);

export function useData<T>(defaultData: T) {
    const { data } = useContext(HtmlTemplateDataContext);
    return {
        data: data ? data as T : defaultData,
        isDefault: (!data),
    };
}

export default function HtmlTemplateDataProvider({ children }) {
    const container = HtmlTemplateDataSetter.defaultValue;
    try {
        container.data = JSON.parse(HtmlTemplateDataSetter.htmlTemplateDataString).parameter;
    } catch (error) {
        //
    }
    return (
        <HtmlTemplateDataContext.Provider value={container}>
            {children}
        </HtmlTemplateDataContext.Provider>
    );
}
