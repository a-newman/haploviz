import React, { Component } from 'react';
import $ from 'jquery'; 
//import Dropdown from '../Dropdown/component.js'

const BASE_URL = 'http://128.52.171.248/';
const RIVIERA_URL = BASE_URL + '/v0/riviera'; 

class Riviera extends Component {
  /*props: 
    trait
  */


  constructor(props) {
    super(props); 
    this.state = {}; 
  }

  componentWillReceiveProps(newprops) {
    console.log(newprops);
  }

  getRivieraData() {
    var data = {
      "trait": parseInt(this.props.trait)
    }
    return $.ajax({
      contentType: 'application/json',
      url: RIVIERA_URL,
      type: 'POST',
      data: JSON.stringify(data),
      success: function(result) {
        console.log("riviera data", result.results); 
      }.bind(this),
      error: function(err) {
        console.log(err)
      }.bind(this)
    })
  }



  run() {
    this.getRivieraData()
    .done(function(result) {
      console.log("result of riviera", result.results);
    })
  }

  
  render() {
    return (  

      <div className="riviera">
        <h1>Trait {this.props.trait}</h1>
        <button onClick={this.run.bind(this)}>Run</button>
      </div>

    );
  }
}; 

export default Riviera;
