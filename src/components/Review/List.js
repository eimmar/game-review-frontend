import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';

import {
    EuiBasicTable,
    EuiPageContentHeader,
    EuiPageContentHeaderSection,
    EuiTitle,
    EuiPageContentBody,
    EuiLoadingSpinner,
} from '@elastic/eui';
import ReviewService from "../../services/reviewService";
import moment from "moment";
import AuthService from "../../services/authService";


class ReviewList extends Component {

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
        (this.props.vehicleId ? ReviewService.getByVehicle(this.props.vehicleId) : ReviewService.getAll())
            .then((response) => {
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
                field: 'comment',
                name: 'Comment',
                truncateText: false,
            },
            {
                field: 'rating',
                name: 'Rating',
            },
            {
                field: 'dateCreated',
                name: 'Date submitted',
                render: (dateString) => moment(dateString).format('YYYY-MM-DD HH:mm:ss')
            },
            {
                field: 'id',
                name: 'Actions',
                render: (id, row) => <>
                    <Link to={"/reviews/" + id}>View</Link>
                    {AuthService.isUser() && <Link className={"ml8"} to={{ pathname: `/reviews-reports/new`, state: {review: row}}}>Report</Link>}
                </>,
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
                            <h2>Review list</h2>
                        </EuiTitle>
                    </EuiPageContentHeaderSection>
                </EuiPageContentHeader>
                <EuiPageContentBody>
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

export default withRouter(ReviewList);
