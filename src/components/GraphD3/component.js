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
      dataOptions: '', 
      plot: null,
      id: "scatterplot-" + this.props.yField,
    }; 
  }


  //What data do we need here? just the snps to plot 

  componentDidMount() {
    var DOMElt = '#' + this.state.id; 
    var plot = new D3Scatterplot(DOMElt, this.state.dataOptions, DIMENSIONS.WIDTH, DIMENSIONS.HEIGHT); 
    plot.create();
    this.setState({
      plot: plot
    }, function() {
      this._updatePlot(this.props);
    }.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps", nextProps);
    this._updatePlot(nextProps);
  }

  _updatePlot(props) {
    console.log("props.yField", props.yField)
    var dataOptions = {
      data: props.SNPsToGraph,
      xConvert: (snp) => snp.position, //maps a SNP to its position 
      yConvert: (snp) => snp[props.yField], //maps a SNP to the probabilty metric we're using
      xLabel: this.props.xLabel,
      yLabel: this.props.yLabel
      //xTicks: this.getXTickValues(),
      //xLabels: this.getXLabels(),
    }; 
    console.log("dataOptions", dataOptions);

    this.state.plot.update(dataOptions);
  }

  render() {

    return(
      <div id={this.state.id}></div>
    ); 
  }
}; 

export default GraphD3;
