import * as React from 'react'
import { CircularProgress } from '@material-ui/core'

import Centered from './Centered/Centered'

export default function PageLoader() {
    return (
        <Centered>
            <CircularProgress />
        </Centered>
    )
}
