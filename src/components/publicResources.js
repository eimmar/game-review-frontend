import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { Card, CardBody, Container, CardImg  } from 'reactstrap';
import {EuiCallOut, EuiText} from '@elastic/eui';
import AuthService from "../services/authService";

class FetchResourcePublic extends Component {

    componentWillMount() {
        if (this.props.location.state && this.props.location.state.success) {
            this.success = this.props.location.state.success;
            this.props.history.replace({
                pathname: this.props.location.pathname,
                state: {}
            });
        }
    }

    renderSuccess() {
        return (
            <EuiCallOut title={this.success} color="success" iconType="check"/>
        )
    }

    render() {
        let currentUser = AuthService.getCurrentUser();
        return (
            <Container style={{marginTop:50}}>
                {this.success ? this.renderSuccess() : ''}
                <EuiText>
                    <h1 className={'text-center'}>Welcome {currentUser ? currentUser.username : ''}</h1>
                </EuiText>
                <div className={'row text-center'} style={{marginTop:40}}>
                    <Card>
                        <CardBody>
                            <CardImg className="responsive-img" alt={"main image"} src={"/front_1920x1200.png"}/>
                        </CardBody>
                    </Card>
                </div>
            </Container>
        )
    }
}
export default withRouter(FetchResourcePublic);
