import $ from 'jquery';

import React, { Component } from 'react';
import Loading from 'react-loading';

const Waiting = ({type, color}) => (
	<Loading type={type} color={color} height="500" width="500"
);

export default Waiting;