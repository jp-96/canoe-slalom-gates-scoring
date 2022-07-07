import React, { createContext, useContext } from 'react';
import HtmlTemplateParameter from '../../api/HtmlTemplateParameter';

const HtmlTemplateParameterContext = createContext(HtmlTemplateParameter.defaultValue);

export function useParameter<T>(defaultValue: T): { parameter: T } {
    const { parameter } = useContext(HtmlTemplateParameterContext);
    return {
        parameter: parameter ? parameter as T : defaultValue
    };
}

export default function HtmlTemplateParameterProvider({ children }) {
    const htmlTemplateParameter = HtmlTemplateParameter.defaultValue;
    try {
        htmlTemplateParameter.parameter = JSON.parse(HtmlTemplateParameter.htmlTemplateParameterString).parameter;
    } catch (error) {
        //
    }
    return (
        <HtmlTemplateParameterContext.Provider value={htmlTemplateParameter}>
            {children}
        </HtmlTemplateParameterContext.Provider>
    );
}