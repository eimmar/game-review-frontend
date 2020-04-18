import * as React from 'react'

import ErrorContent from '../../components/Error/ErrorContent'
import { ErrorLayout } from '../../layouts/ErrorLayout/ErrorLayout'
import { t } from '../../i18n'

export default function NotFound404() {
    document.title = `${t`pageTitle.error`} - ${t`common.websiteName`}`

    return (
        <ErrorLayout>
            <ErrorContent>{t`common.notFoundMessage`}</ErrorContent>
        </ErrorLayout>
    )
}
