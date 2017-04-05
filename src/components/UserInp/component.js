import React, { Component } from 'react';
import Dropdown from '../Dropdown/component.js';
import MultipleSelect from '../MultipleSelect/component.js';

class UserInp extends Component {
  /*props: 
    gwasOptions, 
    defaultGwasMessage, 
    annotationsOptions, 
    defeaultAnnotationsMessage,
    onSubmit
    firstSubmit
  */

  constructor(props) {
    super(props); 
    this.state = {
      selectedGwas: {},
      selectedAnnotations: {}
    }; 
  }

  onChangeGwas(event) {
    console.log("Gwas changed", event.target.value.name); 
    this.setState(
      {selectedGwas: event.target.value}
    );
  }

  onChangeAnnotations(event) {
    console.log("Annotation changed", event.target.value); 
    this.setState(
      {selectedAnnotations: event.target.value}
    );
  }

  submit() {
    this.props.onSubmit(this.state);
  }

  render() {

    var heading = this.props.alreadySubmitted 
      ? <h1>Refine your search</h1>
      : <h1>Select a gwas and annotation to get started</h1>; 
    return (  

      <div className="userinp">
        {heading}

        <Dropdown 
          options={this.props.gwasOptions} 
          defaultMessage={this.props.defaultGwasMessage} 
          onChange={this.onChangeGwas.bind(this)}
        />

        <h>Select a set of annotation</h>
        <MultipleSelect
          options={this.props.annotationsOptions}
          onChange={this.onChangeAnnotations.bind(this)}
        />

        <button onClick={this.submit.bind(this)}>Submit</button>
      </div>

    );
  }
}; 

export default UserInp;
