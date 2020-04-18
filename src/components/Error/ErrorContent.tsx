import * as React from 'react'
import Typography from '@material-ui/core/Typography'

import styles from './ErrorContent.module.scss'
import { flattenClasses } from '../../services/Util/StyleUtils'

export default class ErrorContent extends React.PureComponent {
    render() {
        const classes = flattenClasses([styles.container, 'text-center'])
        const { children } = this.props

        return (
            <div className={classes}>
                <Typography variant="h6" className={styles.header}>
                    {children}
                </Typography>
            </div>
        )
    }
}
