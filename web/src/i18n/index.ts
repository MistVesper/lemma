import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import zh from "./locales/zh.json";

function syncDocumentLang(language: string): void {
    document.documentElement.lang = language.startsWith("zh") ? "zh-CN" : "en";
}

i18n.on("languageChanged", syncDocumentLang);

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            zh: { translation: zh },
        },
        fallbackLng: "en",
        interpolation: { escapeValue: false },
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
            lookupLocalStorage: "lemma.lang",
        },
    });

syncDocumentLang(i18n.language);

export { i18n };
