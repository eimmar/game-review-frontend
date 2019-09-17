import React, { Component, Fragment } from 'react';
import {Link, withRouter} from 'react-router-dom';
import { EuiTabs, EuiTab } from '@elastic/eui';


class NavBar extends Component {
    constructor(props) {
        super(props);

        this.tabs = [
            {
                id: 'home_link',
                name: 'Home',
                disabled: false,
                href: '/',
            },
            {
                id: 'vehicle_list',
                name: 'Vehicles',
                disabled: false,
                href: '/vehicles',
            },
            {
                id: 'review_list',
                name: 'Reviews',
                disabled: false,
                href: '/reviews',
            },
        ];

        this.state = {
            selectedTabHref: window.location.pathname,
        };
    }

    onSelectedTabChanged = href => {
        this.setState({
            selectedTabHref: href,
        });
    };

    renderTabs() {
        return this.tabs.map((tab, index) => (
            <EuiTab
                isSelected={tab.href === this.state.selectedTabHref}
                disabled={tab.disabled}
                key={index}>
                <Link to={tab.href}
                      onClick={() => this.onSelectedTabChanged(tab.href)}>
                    {tab.name}
                </Link>
            </EuiTab>
        ));
    }

    render() {
        return (
            <Fragment>
                <EuiTabs>
                    <div className={"main-container"}>
                        {this.renderTabs()}
                    </div>
                </EuiTabs>
            </Fragment>
        );
    }
}
export default withRouter(NavBar);
