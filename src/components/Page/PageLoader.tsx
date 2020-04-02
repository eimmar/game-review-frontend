import * as React from 'react'
import { CircularProgress } from '@material-ui/core'

import styles from './PageLoader.module.scss'
import { flattenClasses } from '../../services/Util/StyleUtils'

export default function PageLoader() {
    const classes = flattenClasses(['text-center', styles.container])

    return (
        <div className={classes}>
            <div className={styles.loader}>
                <CircularProgress />
            </div>
        </div>
    )
}
