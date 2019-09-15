import React, {Component} from 'react';

import {EuiText} from '@elastic/eui';
import {Link} from "react-router-dom";

class View extends Component {
    render() {
        console.log(this.props.match.params)
        return (
            <div>
                <EuiText grow={false}>
                    <Link to={"/vehicles"}>Back</Link>
                    <Link to={"/vehicles"}>Edit</Link>
                    <dl>
                        <dt>The Elder Scrolls: Morrowind</dt>
                        <dd>The opening music alone evokes such strong memories.</dd>
                        <dt>TIE Fighter</dt>
                        <dd>
                            The sequel to XWING, join the dark side and fly for the Emporer.
                        </dd>
                        <dt>Quake 2</dt>
                        <dd>The game that made me drop out of college.</dd>
                    </dl>
                </EuiText>
            </div>
        );
    }
}
export default View;
