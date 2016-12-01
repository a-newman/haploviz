import React, { Component } from 'react';
import GraphD3 from '../GraphD3/component.js'
import * as d3 from "d3";

class Graph extends Component {
  //props: snps, posteriors
  constructor(props) {
    super(props); 
    this.state = {}; 
  }

  //when the component receives new props (i.e. updated snp data)
  componentWillReceiveProps(nextProps) {
    this.set_snp_posteriors(nextProps.snps, nextProps.posteriors);

    var chs = this.sort_snps_by_chromosome(nextProps.snps); 
    var lens = this.get_chromosome_lengths(chs); 
    this.get_chromosome_start(lens);
  }

  sort_snps_by_chromosome(snps) {
    if (snps.length === 0) {
      return;
    }

    var chs = {} //obj to store list of chromsomes by property 

    snps.forEach(function(snp) {
      var chr = snp.chr.toString(); 

      if (chs.hasOwnProperty(chr)) {
        //add the current snp to the array for that chr
        chs[chr].push(snp)
      } else {
        //create a new entry and initialize an array with the current snp
        chs[chr] = [snp];
      }
    }); 

    this.setState({
      chs: chs
    });
    return chs;
  }

  get_chromosome_lengths(chs) {
    //chs: a dictionary mapping chromsome number to a list of snps in that chr, as produced by sort_snps_by_chromsome
    var chr_len = {}; 

    //Loop over each chromosome
    for (var chr in chs) {

      //The current property is not a direct property of chs
      if (!chs.hasOwnProperty(chr)) {
        continue;
      }

      var extent;
      var snps = chs[chr];
      extent = d3.extent(snps, snp => snp.position); //form min, max
      chr_len[chr] = extent[1];
    }; 

    this.setState({
      chr_len: chr_len
    }); 

    return chr_len;
  }

  get_chromosome_start(chs_len) {
    //loop through the chromosomes, sum up their lengths to get the starting pos of the chromosome
    var chr_start_pos = {}; 
    var chromosomes = Object.getOwnPropertyNames(chs_len);
    var total_x = 0;
    var cur_len = 0;
    
    chromosomes.sort(function(a, b) {
      if (parseInt(a) > parseInt(b)) {
        return 1;
      } else {
        return -1
      }
    });
    
    chromosomes.forEach(function(elt, i) {
      //Get the length of the current chromosome and add it to the total 
      if (chs_len.hasOwnProperty(elt)) {
        chr_start_pos[elt] = total_x; 
        total_x = total_x + chs_len[elt]
      }
    }); 

    this.setState({
      chr_start_pos: chr_start_pos, 
      max_x_pos: total_x
    }); 

    return chr_start_pos;
  }

  set_snp_posteriors(snps, posteriors) {
    if (!(snps && posteriors)) {return}

    snps.forEach(function(snp) {
      snp.posterior = posteriors[snp.rsid];
    }); 

    this.setState({
      snps: this.props.snps
    })
  }

  render() {

    return (  

      <GraphD3 
        snps={this.state.snps} 
        chrStartPos={this.state.chr_start_pos}
        maxXPos={this.state.max_x_pos}
      />

    );
  }
}; 

export default Graph;
