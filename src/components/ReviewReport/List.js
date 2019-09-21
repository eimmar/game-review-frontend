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
import ReviewReportService from "../../services/reviewReportService";
import moment from "moment";


class ReviewReportList extends Component {

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
        ReviewReportService.getAll().then((response) => {
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
                field: 'status',
                name: 'Staus',
                render: (status) => ReviewReportService.getStatusName(status)
            },
            {
                field: 'dateCreated',
                name: 'Date submitted',
                render: (dateString) => moment(dateString).format('YYYY-MM-DD HH:mm:ss')
            },
            {
                field: 'id',
                name: 'Actions',
                render: (id) => <Link to={"/reviews-reports/" + id}>View</Link>,
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
                            <h2>Review Report list</h2>
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

export default withRouter(ReviewReportList);
