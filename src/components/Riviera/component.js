import React, { Component } from 'react';
//import Dropdown from '../Dropdown/component.js'

const BASE_URL = 'http://128.52.171.248/';
const RIVIERA_URL = BASE_URL + '/v0/riviera'; 

class UserInp extends Component {
  /*props: 
    
  */


  constructor(props) {
    super(props); 
    this.state = {}; 
  }



  run() {
    console.log("Watch me go!");
  }

  
  render() {
    return (  

      <div className="riviera">
        <h1>Riviera!</h1>
        <button onClick={this.run.bind(this)}>Run</button>
      </div>

    );
  }
}; 

export default UserInp;
