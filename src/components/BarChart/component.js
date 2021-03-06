import React, { Component } from 'react';
import D3BarChart from '../../d3BarChart.js'

const ID = "d3-chart";
const NUM_ANNOTATIONS = 10;

class BarChart extends Component {
  //props: weights
  constructor(props) {
    super(props); 
    this.state = {
      plot: null
    };
  }

  //create a new plot, add it to the DOM
  componentDidMount() {
    var DOMElt = '#' + ID; 
    var chart = new D3BarChart(DOMElt, 1000, 400); 
    chart.create();
    chart.update(this.getTopAnnotations(this.props.weights));
    this.setState({
      chart: chart
    });
  }

  componentWillReceiveProps(nextProps) {
    var topAnnotations = this.getTopAnnotations(nextProps.weights);
    this.state.chart.update(topAnnotations);;
  }

  /**
  Returns an array of the top n annotations by weight 
  */
  getTopAnnotations(annotations) {
    var n = NUM_ANNOTATIONS;
    function comparator(a, b) {
      return b.w - a.w;
    }
    
    var topN = [];
    for (var i in annotations) {
      var elt = annotations[i];
      if (topN.length < n) {
        topN.push(elt);
      }

      else {
          topN = topN.sort(comparator); 
        if (elt.w > topN.slice(-1).pop().w) {
          topN.pop(); //remove last element
          topN.push(elt); //add new element
        }
      }
    }
    
    topN.sort(comparator);
    console.log("topN ", topN);
    return topN;
 }

  render() {

    return (  

      <div id={ID}></div>

    );
  }
}; 

export default BarChart;
