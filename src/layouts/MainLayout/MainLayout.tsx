import * as React from 'react';

import styles from './MainLayout.module.scss';
import { ContentLayout } from '../ContentLayout/ContentLayout';

export class MainLayout extends React.PureComponent {
    render() {
        const { children } = this.props;

        return (
            <div className={styles.mainLayout}>
                <div className={styles.content}>
                    <ContentLayout>{children}</ContentLayout>
                </div>
            </div>
        );
    }
}
