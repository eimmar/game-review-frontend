import * as React from 'react'
import Box from '@material-ui/core/Box'
import CssBaseline from '@material-ui/core/CssBaseline'

import styles from './ErrorLayout.module.scss'
import Copyright from '../../components/Copyright/Copyright'

interface Props {
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

export class ErrorLayout extends React.PureComponent<Props> {
    render() {
        const { children } = this.props

        return (
            <div className={styles.errorLayout}>
                <div className={styles.content}>
                    <CssBaseline />
                    {children}
                    <Box>
                        <Copyright />
                    </Box>
                </div>
            </div>
        )
    }
}
