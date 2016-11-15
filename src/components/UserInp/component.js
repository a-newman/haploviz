import React, { Component } from 'react';
import Dropdown from '../Dropdown/component.js'

class UserInp extends Component {
  //props: options, defaultMessage, onSubmit
  constructor(props) {
    super(props); 
    this.state = {
      selected: {}
    }; 
  }

  onChange(event) {
    this.setState(
      {selected: event.target.value}
    );
  }

  submit() {
    this.props.onSubmit(this.state.selected);
  }

  render() {
    return (  

      <div className="userinp">
        <h1>This is the user input dropdown!</h1>

        <Dropdown 
          options={this.props.options} 
          defaultMessage={this.props.defaultMessage} 
          onChange={this.onChange.bind(this)}
        />

        <button onClick={this.submit.bind(this)}>Submit!</button>
      </div>

    );
  }
}; 

export default UserInp;
