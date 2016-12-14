import React, { Component } from 'react';
import * as d3 from "d3";
import D3Scatterplot from '../../d3Scatterplot.js'

const ID = 'scatterplot';

class GraphD3 extends Component {
  //What props do we need? the snps and the cumulative chr.len 
  //props: snps, chrStartPos, maxXPos
  constructor(props) {
    super(props); 
    this.state = {
      dataOptions: '', 
      plot: null
    }; 
  }

  componentDidMount() {
    var DOMElt = '#' + ID; 
    var plot = new D3Scatterplot(DOMElt, this.state.dataOptions, 960, 200); 
    plot.create();
    this.setState({
      plot: plot
    });
  }

  componentWillReceiveProps(nextProps) {
    this.getDataOptions(nextProps);

    this.state.plot.update(this.state.dataOptions);
  }

  getDataOptions(props) {
    //dataOptions: data, xMax, yMax, xConvert, yConvert, xTicks
    var dataOptions = {
      data: props.snps,
      xMax: props.maxXPos,
      yMax: 1,
      xConvert: this.get_snp_x_pos.bind(this),
      yConvert: this.get_snp_y_pos.bind(this),
      xTicks: this.getXTickValues(),
      xLabels: this.getXLabels(),
    }; 

    this.setState({
      dataOptions: dataOptions
    });
  }

  get_snp_x_pos(snp) {
    var x_0 = this.props.chrStartPos[snp.chr];
    return x_0 + snp.position;
  }

  get_snp_y_pos(snp) {
    return snp.posterior;
  }

  getXTickValues() {
    if (!this.props.chrStartPos) {return}
    return Object.values(this.props.chrStartPos);
  }

  getXLabels() {
    if (!this.props.chrStartPos) {return}
    var chromosomes = Object.getOwnPropertyNames(this.props.chrStartPos);
    var xLabelMap = {};
    
    //reverse the chr and their start pos and store in xLabelMap
    chromosomes.forEach(function(chr) {
      xLabelMap[this.props.chrStartPos[chr]] = chr;
    }.bind(this)); 

    var xLabelFunc = function (xVal) {
      return 'Chr ' + xLabelMap[xVal];
    }; 
    return xLabelFunc;
  }

  render() {

    return(
      <div id={ID}></div>
    ); 
  }
}; 

export default GraphD3;
