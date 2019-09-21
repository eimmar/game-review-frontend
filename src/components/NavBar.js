import React, { Component, Fragment } from 'react';
import {Link, withRouter} from 'react-router-dom';
import { EuiTabs, EuiTab, EuiAccordion} from '@elastic/eui';


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
            {
                id: 'review_report_list',
                name: 'Review Reports',
                disabled: false,
                href: '/reviews-reports',
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

    isSelected = (href) => this.state.selectedTabHref === href;

    renderTabs() {
        return this.tabs.map((tab, index) => (
            <EuiTab
                isSelected={this.isSelected(tab.href)}
                disabled={tab.disabled}
                key={index}
                onClick={() => {
                    this.onSelectedTabChanged(tab.href);
                    this.props.history.push(tab.href)
                }}>
                {tab.name}
            </EuiTab>
        ));
    }

    renderHamburgerMenu() {
        return this.tabs.map((tab, index) => (
            <p key={index}>
                <Link to={tab.href}
                      className={this.isSelected(tab.href) ? "active block" : "block"}
                      disabled={tab.disabled}
                      onClick={() => this.onSelectedTabChanged(tab.href)}>
                    {tab.name}
                </Link>
            </p>
        ));
    }

    render() {
        return (
            <Fragment>
                <EuiTabs>
                    <div className={"main-container header"}>
                        <div className={"mobile-hide"}>
                            {this.renderTabs()}
                        </div>
                        <EuiAccordion
                            id="accordion1"
                            className={"desktop-hide"}
                            buttonContent={"Menu"}
                            initialIsOpen={false}>
                            {this.renderHamburgerMenu()}
                        </EuiAccordion>
                    </div>
                </EuiTabs>
            </Fragment>
        );
    }
}
export default withRouter(NavBar);
