import React, {Component} from 'react';

import {
    EuiButton, EuiCallOut, EuiConfirmModal,
    EuiFlexGroup,
    EuiFlexItem,
    EuiLoadingSpinner, EuiOverlayMask,
    EuiSpacer,
    EuiText
} from '@elastic/eui';
import ReviewService from "../../services/reviewService";
import {Link} from "react-router-dom";

class ReviewView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            review: [],
            isLoading: true,
            showDeleteModal: false,
            deletedMessage: false
        }
    }
    componentDidMount() {
        ReviewService.get(this.props.match.params.id).then(response => {
            this.setState({
                review: response.data,
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

        ReviewService.delete(this.state.review.id)
            .then(() => {
                this.setState({
                    deletedMessage: `Review has been deleted!`,
                });
            })
            .catch(reason => (
                this.setState({
                    formError: reason.response.data,
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
        const review = this.state.review;
        return (
            <>
                {this.state.deletedMessage ?
                    <EuiCallOut title={this.state.deletedMessage} color="success" iconType="check">
                        <p>
                            <Link to={"/reviews"}>Return to list</Link>.
                        </p>
                    </EuiCallOut>
                    :
                    <div>
                        {this.state.formError ? this.renderError() : ''}
                        <EuiText grow={false}>
                            <EuiFlexGroup gutterSize="s" alignItems="center">
                                <EuiFlexItem grow={false}>
                                    <EuiButton onClick={() => this.props.history.push('/reviews')} color={"primary"}>
                                        Back
                                    </EuiButton>
                                </EuiFlexItem>
                                <EuiFlexItem grow={false} color={"secondary"}>
                                    <EuiButton onClick={() => this.props.history.push("/reviews/" + review.id + "/edit")}>
                                        Edit
                                    </EuiButton>
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                    <EuiButton onClick={this.showDeleteModal} color={"danger"}>
                                        Delete
                                    </EuiButton>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                            <EuiSpacer />
                            {this.state.isLoading ? <EuiLoadingSpinner size="xl" /> :
                                <>
                                    <h2>
                                        {`Viewing review`}
                                    </h2>
                                    <dl>
                                        <dt>Rating</dt>
                                        <dd>{review.rating}</dd>

                                        <dt>Comment</dt>
                                        <dd>{review.comment}</dd>

                                        <dt>Created at</dt>
                                        <dd>{review.dateCreated}</dd>
                                    </dl>
                                </>}
                        </EuiText>
                        {this.state.showDeleteModal ? <EuiOverlayMask>
                            <EuiConfirmModal
                                title="Are you sure you want to delete this review?"
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
export default ReviewView;
