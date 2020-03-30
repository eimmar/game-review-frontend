import * as React from 'react'

import styles from './ContentLayout.module.scss'

export class ContentLayout extends React.PureComponent {
    render() {
        const { children } = this.props

        return <div className={styles.contentLayout}>{children}</div>
    }
}
