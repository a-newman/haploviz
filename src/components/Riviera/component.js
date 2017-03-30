import React, { Component } from 'react';
import $ from 'jquery'; 
import APICalls from '../../helpers/APICalls.js'; 

class Riviera extends Component {
  /*props: 
    trait
    onReRun
  */

  constructor(props) {
    console.log("riviera initial props", props);
    super(); 
    this.state = {
      round: 1
    }; 
  }

  componentWillReceiveProps(newprops) {
    console.log("Riviera got new props", newprops);
  }

  run() {
    this.props.onReRun(); 
    var round = this.state.round + 1;
    this.setState({
      round: round
    })
  }

  render() {
    return (  

      <div className="riviera">
        <h1>Run another round of riviera</h1>
        <p>You have run {this.state.round} rounds of Riviera.</p>
        <button onClick={this.run.bind(this)}>Run</button>
      </div>

    );
  }
}; 

export default Riviera;
