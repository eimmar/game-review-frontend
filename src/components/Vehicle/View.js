import React, {Component} from 'react';

import {
    EuiButton, EuiCallOut, EuiConfirmModal,
    EuiFlexGroup,
    EuiFlexItem,
    EuiLoadingSpinner, EuiOverlayMask,
    EuiSpacer,
    EuiText
} from '@elastic/eui';
import VehicleService from "../../services/vehicleService";
import {Link} from "react-router-dom";
import ReviewList from "../Review/List";

class VehicleView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicle: [],
            isLoading: true,
            showDeleteModal: false,
            deletedMessage: false
        }
    }
    componentDidMount() {
        VehicleService.get(this.props.match.params.id).then(response => {
            this.setState({
                vehicle: response.data,
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

        VehicleService.delete(this.state.vehicle.id)
            .then(response => {
                this.setState({
                    deletedMessage: `Vehicle "${response.data.brand} ${response.data.model}" has been deleted!`,
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
        const vehicle = this.state.vehicle;
        return (
            <>
                {this.state.deletedMessage ?
                    <EuiCallOut title={this.state.deletedMessage} color="success" iconType="check">
                        <p>
                            <Link to={"/vehicles"}>Return to list</Link>.
                        </p>
                    </EuiCallOut>
                    :
                    <div>
                        {this.state.formError ? this.renderError() : ''}
                        {this.state.isLoading ? <EuiLoadingSpinner size="xl" /> :<EuiText grow={false}>
                            <EuiFlexGroup gutterSize="s" alignItems="center">
                                <EuiFlexItem grow={false}>
                                    <EuiButton onClick={() => this.props.history.push('/vehicles')} color={"primary"}>
                                        Back
                                    </EuiButton>
                                </EuiFlexItem>
                                <EuiFlexItem grow={false} color={"secondary"}>
                                    <EuiButton onClick={() => this.props.history.push("/vehicles/" + vehicle.id + "/" + VehicleService.slugify(vehicle) + "/edit")}>
                                        Edit
                                    </EuiButton>
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                    <EuiButton onClick={this.showDeleteModal} color={"danger"}>
                                        Delete
                                    </EuiButton>
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                    <EuiButton onClick={() => this.props.history.push(`/reviews/new`, {vehicle: vehicle})} color={"primary"}>
                                        Write a review
                                    </EuiButton>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                            <EuiSpacer />

                            <h2>
                                {`Viewing ${this.state.vehicle.brand} ${this.state.vehicle.model }`}
                            </h2>
                            <dl>
                                <dt>Brand</dt>
                                <dd>{vehicle.brand}</dd>

                                <dt>Model</dt>
                                <dd>{vehicle.model}</dd>

                                <dt>Year made</dt>
                                <dd>{vehicle.madeFrom}-{vehicle.madeTo}</dd>

                                <dt>Fuel type</dt>
                                <dd>{vehicle.fuelType}</dd>

                                <dt>Engine capacity</dt>
                                <dd>{(vehicle.engineCapacity / 1000).toFixed(1)} l.</dd>

                                <dt>Power</dt>
                                <dd>{vehicle.power} kW</dd>

                                <dt>Rating</dt>
                                <dd>{vehicle.rating ? parseFloat(vehicle.rating).toFixed(1) + "/5" : "Not Rated"}</dd>
                            </dl>

                            <EuiSpacer />
                            <ReviewList vehicleId={vehicle.id}/>
                        </EuiText>}
                        {this.state.showDeleteModal ? <EuiOverlayMask>
                            <EuiConfirmModal
                                title="Are you sure you want to delete this Vehicle?"
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
export default VehicleView;
