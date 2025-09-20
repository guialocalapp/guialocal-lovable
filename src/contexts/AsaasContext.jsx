
import React, { createContext, useContext } from 'react';

    const AsaasContext = createContext();

    export const AsaasProvider = ({ children }) => {
        
        const contextValue = {
            loading: false,
            apiKey: '',
            saveAsaasSettings: () => console.warn("Asaas integration is disabled."),
            createSubscription: () => console.warn("Asaas integration is disabled."),
            createAsaasCustomer: () => console.warn("Asaas integration is disabled."),
        };

        return (
            <AsaasContext.Provider value={contextValue}>
                {children}
            </AsaasContext.Provider>
        );
    };

    export const useAsaas = () => {
        const context = useContext(AsaasContext);
        if (context === undefined) {
            throw new Error('useAsaas must be used within an AsaasProvider');
        }
        return context;
    };
  