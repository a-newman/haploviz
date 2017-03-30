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
      selectedAnnotations: {}
    }; 
  }

  componentWillReceiveProps(nextProps) {
    console.log("MULTIPLESELECT GOT PROPS", nextProps);
  }

  transformOptions(options) {
    console.log("transforming options");
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

  onChangeAnnotations(event) {
    console.log("Annotation changed", event.target.value); 
    this.setState(
      {selectedAnnotations: event.target.value}
    );
  }

  onChange(selection) {
    console.log("selection changed", selection);
  }

  render() {
    return (

      <div className="annotations-select">
        <Select
          name="annotations-select"
          value="annotations"
          options={this.getOptions()}
          onChange={this.onChange}  
          multi={true}      
        />
      </div>

    )
  }
}; 

export default MultipleSelect;
