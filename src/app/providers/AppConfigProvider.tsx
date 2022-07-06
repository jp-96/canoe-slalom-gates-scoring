import React, { createContext, useContext } from "react";
import AppConfig from "../../api/AppConfig";

type AppConfigContextType = {
    appConfig: AppConfig.AppConfig;
};

const defaultAppConfigContext: AppConfigContextType = {
    appConfig: {
        sheetName: '',
        beginGate: -1,
        gateLength: -1,
    },
};

const AppConfigContext = createContext<AppConfigContextType>(defaultAppConfigContext);

export const useAppConfig = () => useContext(AppConfigContext);

export default function AppConfigProvider({ children, appConfigString }) {
    const appConfig = AppConfig.parseAppConfigString(appConfigString);    
    return (
        <AppConfigContext.Provider value={{ appConfig }}>
            {children}
        </AppConfigContext.Provider>
    );
}
