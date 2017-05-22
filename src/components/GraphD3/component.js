import React, { Component } from 'react';
import * as d3 from "d3";
import D3Scatterplot from '../../d3Scatterplot.js'

const DIMENSIONS = {
  WIDTH: 700,
  HEIGHT: 300
}

class GraphD3 extends Component {
  //props: xLabel, yLabel, SNPsToGraph
  constructor(props) {
    super(props); 
    this.state = {
      initialProps: props,
      dataOptions: '', 
      plot: null,
      id: "scatterplot-" + this.props.yLabel,
    }; 

  }


  //What data do we need here? just the snps to plot 

  componentDidMount() {
    this.setPlot(this.state.initialProps);
  }

  componentWillReceiveProps(nextProps) {
    this.updatePlot(nextProps);
  }

  updatePlot(props) {
    if (!this.state.plot) {
      return;
    }
    
    this.state.plot.destroy();

    this.setPlot(props);
  }

  setPlot(props) {

    if (!props.SNPsToGraph || this.isEmpty(props.SNPsToGraph)) {
      return;
    }

    var dataOptions = {
      data: props.SNPsToGraph,
      xConvert: (snp) => snp.position, //maps a SNP to its position 
      yConvert: (snp) => snp[props.yField], //maps a SNP to the probabilty metric we're using
      xLabel: this.props.xLabel,
      yLabel: this.props.yLabel
      //xTicks: this.getXTickValues(),
      //xLabels: this.getXLabels(),
    }; 
    
    var DOMElt = '#' + this.state.id; 
    var plot = new D3Scatterplot(DOMElt, DIMENSIONS.WIDTH, DIMENSIONS.HEIGHT);  
    plot.update(dataOptions);

    this.setState({
      plot: plot
    })
  }

  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  render() {

    return(
      <div id={this.state.id}></div>
    ); 
  }
}; 

export default GraphD3;
