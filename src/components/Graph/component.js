import $ from 'jquery';

import React, { Component } from 'react';
import GraphD3 from '../GraphD3/component.js'
import * as d3 from "d3";
import APICalls from '../../helpers/APICalls.js'; 
import Dropdown from '../Dropdown/component.js';

class Graph extends Component {
  SNPsCache = {};


  //props: posteriors = mapping
  constructor(props) {
    super(props);

    this.state = {
      graphHasMounted: false
    }

    APICalls.getSNPData()
      .then(function(result) {
        this.setState({
          locationMap: this.getLocationMap(result.results),
          SNPsByLocus: {}
        });
      }.bind(this));
  }

  //when component gets new props (right now just the posteriors), 
  //get the highest probability snp. Then get all snps at that locus. 
  // these are the SNPS to graph, which we pass in 

  componentWillReceiveProps(nextProps) {
    if (this.isEmpty(nextProps.posteriorData) && this.isEmpty(nextProps.priorData)) {return;} //return if no data available 

    if (this.isEmpty(nextProps.posteriorData)) {
      this.graphPriors(nextProps.priorData.priors);
      return;
    }

    var SNPMap = nextProps.posteriorData.posteriors;
    var SNPList = this.transformSNPs(SNPMap); //adds position and rsid to snp object 
    var maxSNP = this.maxProbabilitySNP(SNPList, "probability");
    //now, get all SNPs at that locus
    var locusToGraph = maxSNP.locus;
    var byLocus = this.sortSNPsByLocus(SNPList);
    var SNPsAtLocus = byLocus[locusToGraph];
    var dropdownOptions = this.getDropdownOptions(byLocus);

    this.setState({
      locusToGraph: locusToGraph,
      posteriorsToGraph: SNPsAtLocus,
      maxSNP: maxSNP,
      posteriorsByLocus: byLocus,
      options: dropdownOptions
    });
  }

  graphPriors(priors) {
    console.log("priors", priors);
    var SNPMap = priors;
    var SNPList = this.transformSNPs(SNPMap);
    var byLocus = this.sortSNPsByLocus(SNPList);
    var locusToGraph = Object.getOwnPropertyNames(byLocus)[0]; //get the first locus
    console.log("graphing priors: locus to graph is " + locusToGraph);
    var SNPsAtLocus = byLocus[locusToGraph];
    var dropdownOptions = this.getDropdownOptions(byLocus);

    this.setState({
      locusToGraph: locusToGraph,
      priorsToGraph: SNPsAtLocus,
      priorsByLocus: byLocus,
      options: dropdownOptions,
      graphHasMounted: true
    }, function() {
      console.log("updated state...");
      console.log("updated priors" + this.state.priorsToGraph);
    });
  }

  /**
   * SNPMap: map mapping RSID to features of a SNP
   * field: the field we are filtering on 
   * returns: the object in SNPMap for which obj[field] is greatest
   */
  maxProbabilitySNP(SNPList, field) {
    var maxSNP = {};
    var maxProb = 0;

    SNPList.forEach(function(snp) {
      if (snp[field] > maxProb) {
        //reassign maxSNP and maxProb
          maxProb = snp[field];
          maxSNP = snp;
      }
    })
      
    return maxSNP;
  }

  /**
  */
  sortSNPsByLocus(SNPList) {
    var byLocus = {};

    SNPList.forEach(function(snp) {
      var locus = snp.locus;
      if (byLocus[locus]) {
        byLocus[locus].push(snp);
      } else {
        byLocus[locus] = [snp];
      }
    }); 

    return byLocus;
  }

  transformSNPs(SNPMap) {
    var listing = [];

    for (var RSID in SNPMap) {
      if (!SNPMap.hasOwnProperty(RSID)) {continue;}

      var SNP = SNPMap[RSID];
      var newSNP = {
        position: this.state.locationMap[RSID], //add in the position 
        rsid: RSID //and the RSID as a field instead of a key 
      }

      $.extend(newSNP, SNP); //add to newSNP all the properties of the old SNP

      listing.push(newSNP);
    }

    return listing;
  }



/**
 *Gets all the SNPs at locus locus
 * returns a mapping RSID => SNP with only and all SNPS at locus locus 
 */
  getSNPsAtLocus(locus) {
    return this.state.SNPsByLocus[locus];
  }

  graphNewLocus(onChangeEvent) {
    console.log("locus changed", onChangeEvent.target.value);
    var locus = onChangeEvent.target.value;

    var newPriorSNPs = this.state.priorsByLocus ? this.state.priorsByLocus[locus] : [];
    var newPosteriorSNPs = this.state.posteriorsByLocus ? this.state.posteriorsByLocus[locus] : [];

    this.setState({
      locusToGraph: locus,
      priorsToGraph: newPriorSNPs,
      posteriorsToGraph: newPosteriorSNPs
    })
  }

  getDropdownOptions(SNPsByLocus) {
    var options = []; 

    for (var locus in SNPsByLocus) {

      if (!SNPsByLocus.hasOwnProperty(locus)) {continue;}

      options.push({
          id: locus,
          name: locus.toString()
      }); 
    }

    return options;
  }

  /**
   * Create a mapping RSID => position
   */
  getLocationMap(SNPs) {
    var mapping = {};
    for (var i in SNPs) {
      var SNP = SNPs[i];
      var RSID = SNP.rsid;
      var position = SNP.position;
      mapping[RSID] = position;
    }
    return mapping;
  }

  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  render() {

    var probabilityYMapping = (snp) => snp.probability;
    
    var logProbability = function(snp) {
      var p = snp.pValue;
      var log = Math.log(p)/Math.log(10);
      return -log;
    }

    return (  

      <div>
        {this.state.graphHasMounted && 
          <div>
            <h1>Locus to graph: {this.state.locusToGraph}</h1>
            <Dropdown
              options={this.state.options}
              defaultMessage={"Select a locus to view"} 
              onChange={this.graphNewLocus.bind(this)}
            />
            <GraphD3
              SNPsToGraph={this.state.priorsToGraph}
              xLabel={"SNPs at locus " + this.state.locusToGraph}
              yLabel="Priors"
              yFunc= {probabilityYMapping}
            />
            <GraphD3
              SNPsToGraph={this.state.posteriorsToGraph}
              xLabel = {"SNPs at locus " + this.state.locusToGraph}
              yLabel = "PPAs"
              yFunc = {probabilityYMapping}
            />
            <GraphD3
              SNPsToGraph = {this.state.posteriorsToGraph}
              xLabel = {"SNPs at locus " + this.state.locusToGraph}
              yLabel = "-logP"
              yFunc = {logProbability}
            />
          </div>
        }
      </div>

    );
  }
}; 

export default Graph;
