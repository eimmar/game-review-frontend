import * as React from 'react'

import styles from './Centered.module.scss'
import { flattenClasses } from '../../../services/Util/StyleUtils'

export default function Centered(props: { children: React.ReactElement }) {
    const classes = flattenClasses(['text-center', styles.container])
    const { children } = props

    return (
        <div className={classes}>
            <div className={styles.center}>{children}</div>
        </div>
    )
}
