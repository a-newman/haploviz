import React, { Component } from 'react';
//import Dropdown from '../Dropdown/component.js'

class Output extends Component {
  /*props: 
    
  */


  constructor(props) {
    super(props); 
    this.state = {
      data: '',
    } 
  }



  run() {
    console.log("Watch me go!");
  }

  
  render() {
    return (  

      <div className="output">
        <h1>Output here</h1>
        <div className="displayOutput">
          {this.state.data}
        </div>
      </div>

    );
  }
}; 

export default Output;
