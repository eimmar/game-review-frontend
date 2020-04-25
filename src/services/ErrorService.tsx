import { t } from '../i18n'

export interface ErrorResponse {
    code: number
    message: string
}

function getError(responseStatus: number, error: ErrorResponse): ErrorResponse {
    return { ...error, message: t(`error.code.${error.code || responseStatus}`) }
}

export const errorService = {
    getError,
}
