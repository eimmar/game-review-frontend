import { t } from '../i18n'

export interface ErrorResponse {
    code: number
    message: string
}

function getError(error: ErrorResponse): ErrorResponse {
    return { ...error, message: t(`error.code.${error.code}`) }
}

export const errorService = {
    getError,
}
