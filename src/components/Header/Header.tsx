import * as React from 'react'

import styles from './Header.module.scss'
import { ContentLayout } from '../../layouts/ContentLayout/ContentLayout'

export class Header extends React.PureComponent {
    render() {
        return (
            <header className={styles.header}>
                <ContentLayout>
                    <h1>Header</h1>
                </ContentLayout>
            </header>
        )
    }
}
