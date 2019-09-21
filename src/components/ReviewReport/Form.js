import React, { Component } from 'react';

import {
    EuiButton,
    EuiForm,
    EuiFormRow,
    EuiSpacer,
    EuiCallOut, EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner, EuiText, EuiTextArea, EuiSelect
} from '@elastic/eui';
import {Link} from "react-router-dom";
import ReviewReportService from "../../services/reviewReportService";

class ReviewReportForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSwitchChecked: false,
            formError: '',
            submitting: false,
            isLoading: true,
            reviewReport: {
                id: null,
                review: {},
                comment: '',
                dateCreated: null
            }
        };

        this.onValueChange = this.onValueChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }


    onValueChange(e) {
        let reviewReport = this.state.reviewReport;
        reviewReport[e.target.name] = e.target.value;
        this.setState({
            reviewReport: reviewReport
        })
    }

    componentDidMount() {
        if (this.props.match.params && this.props.match.params.id) {
            ReviewReportService.get(this.props.match.params.id).then(response => {
                this.setState({
                    reviewReport: response.data
                })
            }).finally(() => {
                this.setState({
                    isLoading: false
                });
            })
        } else if (this.state.reviewReport && this.props.location.state && this.props.location.state.review) {
            let reviewReport = this.state.reviewReport;
            reviewReport.review = this.props.location.state.review;
            this.setState({
                reviewReport: reviewReport,
                isLoading: false
            })
        } else {
            this.setState({
                formError: 'Error. Please refresh the page.'
            })
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({
            submitting: true,
            isLoading: true
        });
        let reviewReport = this.state.reviewReport;
        (reviewReport.id ? ReviewReportService.update(reviewReport.id, reviewReport) : ReviewReportService.create(reviewReport))
            .then(() => {
                this.setState({
                    formSuccess: `Review report has been ${reviewReport.id ? 'updated' : 'created'}!`,
                    formError: false,
                    submitting: !reviewReport.id

                });
            }).catch(e => {
            this.setState({
                formError: e.response ? e.response.data : 'Could not ' + (this.state.reviewReport.id ? `update review report` : 'create review report'),
                submitting: false,
            });
        });

        this.setState({
            isLoading: false
        });
    }

    getBackUrl() {
        return `/reviews/`;
    }

    renderError() {
        return (<EuiCallOut title={this.state.formError} color="danger" iconType="alert"/>)
    }

    renderSuccess() {
        return (
            <EuiCallOut title={this.state.formSuccess} color="success" iconType="check">
                <Link to={this.getBackUrl()}>Back to review list</Link>
            </EuiCallOut>
        )
    }

    render() {

        return (
            <>
                <EuiForm name={"reviewReport"}>
                    <EuiFlexGroup gutterSize="s" alignItems="center">
                        <EuiFlexItem grow={false}>
                            <EuiButton onClick={() => this.props.history.push(this.getBackUrl())}>
                                Back
                            </EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                    <EuiSpacer />

                    {this.state.formError ? this.renderError() : ''}
                    {this.state.formSuccess ? this.renderSuccess() : ''}
                    {this.state.isLoading ? <EuiLoadingSpinner size="xl" /> :<form onSubmit={this.handleFormSubmit}>
                        <EuiText>
                            <h2>
                                Reporting review on vehicle
                                {this.state.reviewReport.review.vehicle ?
                                    ' ' + this.state.reviewReport.review.vehicle.brand + ' ' + this.state.reviewReport.review.vehicle.model : ''}
                            </h2>

                            <dt>Review comment</dt>
                            <dd>{this.state.reviewReport.review.comment}</dd>

                            <dt>Review rating</dt>
                            <dd>{this.state.reviewReport.review.rating}/5</dd>

                            <h3>
                                {this.state.reviewReport.id ? `Update Review report` : 'Create Review report'}
                            </h3>
                        </EuiText>

                        <EuiFormRow label="Reason">
                            <EuiTextArea name={"comment"}
                                         placeholder="Write a reason"
                                         value={this.state.reviewReport.comment}
                                         onChange={this.onValueChange}
                            />
                        </EuiFormRow>
                        {this.state.reviewReport.id && <EuiFormRow label="Status">
                            <EuiSelect name={"status"}
                                       options={Object.keys(ReviewReportService.getAllStatuses()).map(item => {
                                           return {text: ReviewReportService.getStatusName(item), value: item}
                                       })}
                                       hasNoInitialSelection={true}
                                       value={this.state.reviewReport.status}
                                       onChange={this.onValueChange}/>
                        </EuiFormRow>}

                        <EuiSpacer />
                        <EuiButton type="submit" fill
                                   isDisabled={this.state.submitting}>
                            {this.state.reviewReport.id ? 'Update' : 'Create'}
                        </EuiButton>
                    </form>}
                </EuiForm>
            </>
        );
    }
}

export default ReviewReportForm;
