import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enLang from './locals/en/en.json';
import ruLang from './locals/ru/ru.json';


const resources = {
  en: {
    translation: enLang
  },
  ru: {
    translation: ruLang
  }
}

const getLang = localStorage.getItem('lang')! || "en";

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLang,
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }
  });