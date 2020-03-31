import * as React from 'react'

import NotFound404Content from '../../components/Error/NotFound404Content'
import { ErrorLayout } from '../../layouts/ErrorLayout/ErrorLayout'

export default function NotFound404() {
    return (
        <ErrorLayout>
            <NotFound404Content />
        </ErrorLayout>
    )
}
