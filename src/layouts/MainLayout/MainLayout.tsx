import * as React from 'react'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import CssBaseline from '@material-ui/core/CssBaseline'

import styles from './MainLayout.module.scss'
import Copyright from '../../components/Copyright/Copyright'

export class MainLayout extends React.PureComponent {
    render() {
        const { children } = this.props

        return (
            <div className={styles.mainLayout}>
                <div className={styles.content}>
                    {/* <ContentLayout>{children}</ContentLayout> */}
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        {children}
                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </Container>
                </div>
            </div>
        )
    }
}
