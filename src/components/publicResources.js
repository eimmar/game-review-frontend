import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { Card, CardBody, Container, CardImg  } from 'reactstrap';
import { EuiText} from '@elastic/eui';
import authService from "../services/authService";

class FetchResourcePublic extends Component {

    render() {
        let currentUser = authService.getCurrentUser();
        return (
            <Container style={{marginTop:50}}>
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
