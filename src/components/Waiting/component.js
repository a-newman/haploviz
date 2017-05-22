import $ from 'jquery';

import React, { Component } from 'react';
import Loading from 'react-loading';

const SIZE = 200;

class Waiting extends Component {
	constructor(props) {
		super (props);
	}

	render() {
		if (this.props.isVisible) {
			return (
				<div>
					<h1>Please wait while we perform some calculations</h1>
					<Loading type="spin" 
						color="grey" 
						height="100px" 
						width="100px" 
						style={{
							"textAlign": "center", 
							"width": SIZE + "px",
							"height": SIZE + "px",
							"margin": "0 auto"
						}}
					/>
				</div>
			)
		} else {
			return null;
		}
	}

}

export default Waiting;