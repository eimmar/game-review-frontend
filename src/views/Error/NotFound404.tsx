import * as React from 'react'

import ErrorContent from '../../components/Error/ErrorContent'
import { ErrorLayout } from '../../layouts/ErrorLayout/ErrorLayout'
import { t } from '../../i18n'

export default function NotFound404() {
    return (
        <ErrorLayout>
            <ErrorContent>{t`common.notFoundMessage`}</ErrorContent>
        </ErrorLayout>
    )
}
