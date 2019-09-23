import {Component} from 'react';

import AuthService from "../../services/authService";

class Logout extends Component {

    componentDidMount() {
        AuthService.logout();
        return this.props.history.push({
            pathname: "/",
        });
    }
    render = () => ''
}
export default Logout;
