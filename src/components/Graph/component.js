import React, { Component } from 'react';

class Graph extends Component {
  //props: snps
  constructor(props) {
    super(props); 
    this.state = {
      hi: '',
    }; 
  }

  render() {
    return (  

      <div className="graph">
        <h1>This is where the chart will go!</h1>

        
      </div>

    );
  }
}; 

export default Graph;
