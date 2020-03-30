import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import moment from 'moment'

import { ltTranslations } from './translations/lt'

i18n.use(LanguageDetector).init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'lt',
    keySeparator: false,
    resources: {
        lt: {
            translation: ltTranslations,
        },
    },
    interpolation: {
        format: (value, format) => {
            if (format === 'date') {
                return moment(value).format('DD.MM.YYYY')
            }

            if (format === 'fullDate') {
                return moment(value).format('dddd MMMM Do, YYYY - HH:mm')
            }

            return value
        },
    },
})

i18n.on('languageChanged', (lng) => {
    moment.locale(lng)
})

export const t = i18n.t.bind(i18n)

export default i18n
