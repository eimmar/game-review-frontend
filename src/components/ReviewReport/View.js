import React, {Component} from 'react';

import {
    EuiButton, EuiCallOut, EuiConfirmModal,
    EuiFlexGroup,
    EuiFlexItem,
    EuiLoadingSpinner, EuiOverlayMask,
    EuiSpacer,
    EuiText
} from '@elastic/eui';
import ReviewReportService from "../../services/reviewReportService";
import {Link} from "react-router-dom";
import moment from "moment";
import AuthService from "../../services/authService";

class ReviewReportView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviewReport: [],
            isLoading: true,
            showDeleteModal: false,
            deletedMessage: false
        }
    }
    componentDidMount() {
        ReviewReportService.get(this.props.match.params.id).then(response => {
            this.setState({
                reviewReport: response.data,
                isLoading: false
            })
        })
    }

    closeDeleteModal = () => {
        this.setState({ showDeleteModal: false });
    };

    confirmDeleteModal = () => {
        this.setState({
            isLoading: true,
        });

        ReviewReportService.delete(this.state.reviewReport.id)
            .then(() => {
                this.setState({
                    deletedMessage: `Review report has been deleted!`,
                });
            })
            .catch(e => (
                this.setState({
                    formError: e.response ? e.response.data : "Access denied.",
                })
            ))
            .finally(() => {
                this.setState({
                    showDeleteModal: false,
                    isLoading: false
                })
            });
    };

    showDeleteModal = () => {
        this.setState({ showDeleteModal: true });
    };

    renderError() {
        return (<EuiCallOut title={this.state.formError} color="danger" iconType="alert"/>)
    }

    render() {
        const reviewReport = this.state.reviewReport;
        return (
            <>
                {this.state.deletedMessage ?
                    <EuiCallOut title={this.state.deletedMessage} color="success" iconType="check">
                        <p>
                            <Link to={"/reviews-reports"}>Return to list</Link>.
                        </p>
                    </EuiCallOut>
                    :
                    <div>
                        {this.state.formError ? this.renderError() : ''}
                        {this.state.isLoading ? <EuiLoadingSpinner size="xl" /> :<EuiText grow={false}>
                            <EuiFlexGroup gutterSize="s" alignItems="center">
                                <EuiFlexItem grow={false}>
                                    <EuiButton onClick={() => this.props.history.push('/reviews-reports')} color={"primary"}>
                                        Back
                                    </EuiButton>
                                </EuiFlexItem>
                                {AuthService.isAdmin() && <EuiFlexItem grow={false} color={"secondary"}>
                                    <EuiButton onClick={() => this.props.history.push("/reviews-reports/" + reviewReport.id + "/edit")}>
                                        Edit
                                    </EuiButton>
                                </EuiFlexItem>}
                                {AuthService.isSuperAdmin() && <EuiFlexItem grow={false}>
                                    <EuiButton onClick={this.showDeleteModal} color={"danger"}>
                                        Delete
                                    </EuiButton>
                                </EuiFlexItem>}
                            </EuiFlexGroup>
                            <EuiSpacer />
                            <h2>
                                {`Viewing review report`}
                            </h2>
                            <dl>
                                <dt>Review comment</dt>
                                <dd>{reviewReport.review.comment}</dd>

                                <dt>Review rating</dt>
                                <dd>{reviewReport.review.rating}/5</dd>

                                <dt>Reason for reporting</dt>
                                <dd>{reviewReport.comment}</dd>

                                <dt>Report status</dt>
                                <dd>{ReviewReportService.getStatusName(reviewReport.status)}</dd>

                                <dt>Created at</dt>
                                <dd>{moment(reviewReport.dateCreated).format('YYYY-MM-DD HH:mm:ss')}</dd>
                            </dl>
                        </EuiText>}
                        {this.state.showDeleteModal ? <EuiOverlayMask>
                            <EuiConfirmModal
                                title="Are you sure you want to delete this review report?"
                                onCancel={this.closeDeleteModal}
                                onConfirm={this.confirmDeleteModal}
                                cancelButtonText="No"
                                confirmButtonText="Yes"
                                buttonColor="danger"
                                defaultFocusedButton="confirm">
                                <p>This action cannot be undone.</p>
                            </EuiConfirmModal>
                        </EuiOverlayMask> : ''}
                    </div>
                }
            </>
        );
    }
}
export default ReviewReportView;
