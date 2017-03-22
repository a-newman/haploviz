import React, { Component } from 'react';
import Dropdown from '../Dropdown/component.js'

class UserInp extends Component {
  /*props: 
    gwasOptions, 
    defaultGwasMessage, 
    annotationsOptions, 
    defeaultAnnotationsMessage,
    onSubmit
  */

  constructor(props) {
    super(props); 
    this.state = {
      selectedGwas: {},
      selectedAnnotations: {}
    }; 
  }

  onChangeGwas(event) {
    console.log("Gwas changed", event.target.value); 
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
    return (  

      <div className="userinp">
        <h1>This is the user input dropdown!</h1>

        <Dropdown 
          options={this.props.gwasOptions} 
          defaultMessage={this.props.defaultGwasMessage} 
          onChange={this.onChangeGwas.bind(this)}
        />

        <Dropdown 
          options={this.props.annotationsOptions}
          defaultMessage={this.props.defaultAnnotationsMessage}
          onChange={this.onChangeAnnotations.bind(this)}
        />

        <button onClick={this.submit.bind(this)}>Submit</button>
      </div>

    );
  }
}; 

export default UserInp;
