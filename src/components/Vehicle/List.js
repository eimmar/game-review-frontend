import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';

import {
    EuiBasicTable,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPageContentHeader,
    EuiPageContentHeaderSection,
    EuiTitle,
    EuiPageContentBody,
    EuiLoadingSpinner,
    EuiButton, EuiSpacer
} from '@elastic/eui';
import VehicleService from "../../services/vehicleService";


class VehicleList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pageIndex: 0,
            pageSize: 10,
            allItems: [],
            pageOfItems: [],
            isLoading: true,
        };
    }

    onTableChange = ({ page = {} }) => {
        const { index: pageIndex, size: pageSize } = page;

        this.setState({
            pageIndex,
            pageSize,
        });
    };

    componentDidMount() {
        VehicleService.getAll().then((response) => {
            this.setState({
                allItems: response.data,
                isLoading: false
            })
        });
    }

    render() {
        const { pageIndex, pageSize } = this.state;
        let startIndex = pageIndex * pageSize;
        const pageOfItems = this.state.allItems.slice(startIndex, startIndex + pageSize);
        const totalItemCount = this.state.allItems.length;

        const columns = [
            {
                field: 'brand',
                name: 'Brand',
                truncateText: true,
                hideForMobile: true,
                mobileOptions: {
                    show: false,
                },
            },
            {
                field: 'model',
                name: 'Model',
                truncateText: true,
                mobileOptions: {
                    show: false,
                },
            },
            {
                field: 'madeFrom',
                name: 'Year made',
                mobileOptions: {
                    header: false,
                    only: true,
                    enlarge: true,
                    fullWidth: true,
                },
                render: (name, item) => (
                    <EuiFlexGroup responsive={false} alignItems="center">
                        <EuiFlexItem>
                            {item.madeFrom}-{item.madeTo}
                        </EuiFlexItem>
                    </EuiFlexGroup>
                ),
            },
            {
                field: 'fuelType',
                name: 'Fuel Type',
                truncateText: true,
                mobileOptions: {
                    show: false,
                },
            },
            {
                field: 'engineCapacity',
                name: 'Engine Capacity',
                render: capacity => (capacity / 1000).toFixed(1) + "l",
            },
            {
                field: 'power',
                name: 'Power',
                render: power => power + "kw",
            },
            {
                field: 'id',
                name: 'Actions',
                render: (id, item) => <Link to={"/vehicles/" + id + '/' + VehicleService.slugify(item)}>View</Link>,
            }
        ];

        const pagination = {
            pageIndex,
            pageSize,
            totalItemCount,
            pageSizeOptions: [10, 20, 50],
            hidePerPageOptions: false,
        };

        return (
            <>
                <EuiPageContentHeader>
                    <EuiPageContentHeaderSection>
                        <EuiTitle>
                            <h2>Vehicle list</h2>
                        </EuiTitle>
                    </EuiPageContentHeaderSection>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                    <EuiFlexGroup gutterSize="s" alignItems="center">
                        <EuiFlexItem grow={false}>
                            <EuiButton onClick={() => this.props.history.push('/vehicles/new')}>
                                Add New
                            </EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                    <EuiSpacer />
                    {this.state.isLoading ? <EuiLoadingSpinner size="xl" /> :
                        <EuiBasicTable
                        items={pageOfItems}
                        columns={columns}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />}
                </EuiPageContentBody>
            </>
        );
    }
}

export default withRouter(VehicleList);
