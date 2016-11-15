import React, { Component } from 'react';

function Options(props) {
    const defaultItem = [
      <option disabled key='null' value='default'>
        {props.defaultMessage}
      </option>
    ]; 

    const optionItems = defaultItem.concat(props.options.map((option) => 
      <option key={option.id} value={option.id}>
        {option.name}
      </option>
    ));

    return (
      <select defaultValue={props.value} onChange={props.onChange}>
        {optionItems}
      </select>
    ); 
}

class Dropdown extends Component {
  //props: options, defaultMessage, onChange
  constructor(props) {
    super(props); 
    this.state = {value: 'default'}; 
  }

  render() {
    return (
      <div className="userinp">
        <Options 
          options={this.props.options} 
          defaultMessage={this.props.defaultMessage} 
          value={this.state.value} 
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}; 

export default Dropdown;
