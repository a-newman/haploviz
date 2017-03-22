import React, { Component } from 'react';
import $ from 'jquery'; 
import APICalls from '../../helpers/APICalls.js'; 

class Riviera extends Component {
  /*props: 
    trait
  */

  constructor(props) {
    super(props); 
    this.state = {}; 
  }

  componentWillReceiveProps(newprops) {
    console.log("Riviera got new props", newprops);
  }

  render() {
    return (  

      <div className="riviera">
        <h1>Trait {this.props.trait}</h1>
        <button onClick={this.props.onReRun}>Run</button>
      </div>

    );
  }
}; 

export default Riviera;
