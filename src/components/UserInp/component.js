import React, { Component } from 'react';

function Options(props) {
    const defaultItem = [
      <option disabled key='null' value='default'>
        {props.defaultMessage}
      </option>
    ]; 

    //const optionItems = props.options.map((option) => 
    const optionItems = defaultItem.concat(["option1", "option2"].map((option) => 
      <option key={option} value={option}>
        {option}
      </option>
    ));

    return (
      <select defaultValue={props.value}>
        {optionItems}
      </select>
    ); 
}

class UserInp extends Component {
  constructor(props) {
    //props should contain an option like 'options' that has drpodown options
    super(props); 
    this.state = {value: 'default'}; 
  }

  render() {
    return (
      <div className="userinp">
        <h1>This is the user input dropdown!</h1>
        <Options options='' defaultMessage='Select an annotation' value={this.state.value}/>
      </div>
    );
  }
}; 

export default UserInp;
