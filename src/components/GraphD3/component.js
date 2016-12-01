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
    //dataOptions: data, xMax, yMax, xConvert, yConvert
    var dataOptions = {
      data: props.snps,
      xMax: props.maxXPos,
      yMax: 1,
      xConvert: this.get_snp_x_pos.bind(this),
      yConvert: this.get_snp_y_pos.bind(this)
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

  render() {


    var style = {
      width: '960px',
      height: '100px'
    }; 

    return(
      <div id={ID} style={style}></div>
    ); 
  }
}; 

export default GraphD3;
