import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class MultipleSelect extends Component {
  /*props: 
    options
  */

  constructor(props) {
    super(props); 
    this.state = {
      crazy: false,
    }; 
  }

  transformOptions(options) {
    var transformedOptions = options.map(function(option) {
      return {
        value: option.id,
        label: option.name
      }
    })

    return transformedOptions;
  }

  getOptions() {
    return [
      {
        value: 'one',
        label: "apple"
      }, 
      {
        value: 'two',
        label: "banana"
      },
      {
        value: 'three',
        label: "sthg"
      }

    ]
  }

  onChange(selection) {
    this.setState({value: selection}, function() {
      this.props.onChange(selection);
    });
  }

  render() {
    return (

      <div className="annotations-select">
        <Select
          multi
          name="annotations-select"
          value={this.state.value}
          placeholder="Select annotations"
          options={this.transformOptions(this.props.options)}
          onChange={this.onChange.bind(this)}        
        />
      </div>

    )
  }
}; 

export default MultipleSelect;
