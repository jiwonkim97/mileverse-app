import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import ko from './ko.json';
import en from './en.json';

const resources =  {
    en: {
        translation: en
    },
    ko: {
        translation: ko
    }
};
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (cb) => {
    console.log('lang', RNLocalize.getLocales()[0].languageCode);
    cb(RNLocalize.getLocales()[0].languageCode);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};
i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation:{
        escapeValue:false
    },
    resources: resources,
    react: {
      useSuspense: false
    }
});