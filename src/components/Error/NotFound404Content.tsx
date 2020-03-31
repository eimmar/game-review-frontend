import * as React from 'react'
import Typography from '@material-ui/core/Typography'

import { t } from '../../i18n'
import styles from './NotFound404Content.module.scss'
import { flattenClasses } from '../../services/Util/StyleUtils'

export default function NotFound404Content() {
    const classes = flattenClasses([styles.container, 'text-center'])

    return (
        <div className={classes}>
            <Typography variant="h4" className={styles.header}>{t`common.notFoundMessage`}</Typography>
        </div>
    )
}
