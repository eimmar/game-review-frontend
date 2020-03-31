import * as React from 'react'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import CssBaseline from '@material-ui/core/CssBaseline'

import styles from './MainLayout.module.scss'
import Copyright from '../../components/Copyright/Copyright'
import { Header } from '../../components/Header/Header'

interface Props {
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

export class MainLayout extends React.PureComponent<Props> {
    render() {
        const { children, maxWidth } = this.props

        return (
            <div className={styles.mainLayout}>
                <Header />
                <div className={styles.content}>
                    <Container component="main" maxWidth={maxWidth}>
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
