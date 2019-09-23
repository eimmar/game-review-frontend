import React, { Component, Fragment } from 'react';
import {Link, withRouter} from 'react-router-dom';
import { EuiTabs, EuiTab, EuiAccordion} from '@elastic/eui';
import Navigation from "../utils/navigation";


class NavBar extends Component {
    constructor(props) {
        super(props);

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

    renderTabs(tabs) {
        return tabs.map((tab, index) => (
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

    renderHamburgerMenu(tabs) {
        return tabs.map((tab, index) => (
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
        let tabs = Navigation.buildTabs();
        return (
            <Fragment>
                <EuiTabs>
                    <div className={"main-container header"}>
                        <div className={"mobile-hide"}>
                            {this.renderTabs(tabs)}
                        </div>
                        <EuiAccordion
                            id="accordion1"
                            className={"desktop-hide"}
                            buttonContent={"Menu"}
                            initialIsOpen={false}>
                            {this.renderHamburgerMenu(tabs)}
                        </EuiAccordion>
                    </div>
                </EuiTabs>
            </Fragment>
        );
    }
}
export default withRouter(NavBar);
