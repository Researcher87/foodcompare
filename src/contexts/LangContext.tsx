import {createContext, useState} from "react";

export interface LanguageProviderProps {
    language: string
    userLanguageChange: (selectedLanguage: string) => void
}

export const LanguageContext = createContext<LanguageProviderProps>({
    language: 'en',
    userLanguageChange: (selectedLanguage) => {return 'en'}
});

export function LanguageProvider({ children }) {
    const defaultLanguage = window.localStorage.getItem('rcml-lang');
    const [language, setLanguage] = useState(defaultLanguage || 'en');

    const userLanguageChange = (selectedLanaguage: string): void => {
        const newLanguage = selectedLanaguage ? selectedLanaguage : 'en'
        setLanguage(newLanguage);
        window.localStorage.setItem('rcml-lang', newLanguage);
    }

    const provider: LanguageProviderProps = {
        language,
        userLanguageChange
    };

    return (
        <LanguageContext.Provider value={provider}>
            {children}
        </LanguageContext.Provider>
    );
};



