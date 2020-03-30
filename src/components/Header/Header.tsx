import * as React from 'react'

import styles from './Header.module.scss'
import { ContentLayout } from '../../layouts/ContentLayout/ContentLayout'
import { flattenClasses } from '../../services/Util/StyleUtils'

export class Header extends React.PureComponent {
    render() {
        const classes = flattenClasses([styles.header, 'm-t-30'])

        return (
            <header className={classes}>
                <ContentLayout>
                    <h1>Header</h1>
                </ContentLayout>
            </header>
        )
    }
}
