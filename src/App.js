import React, { Component } from 'react';
import $ from 'jquery'; 
import UserInp from './components/UserInp/component.js';
import Graph from './components/Graph/component.js';
import './App.css';

const BASE_URL = 'http://128.52.171.248/'; 
const GWAS_URL = BASE_URL + 'v0/traits'; 
const WEIGHTS_URL = BASE_URL + 'v0/riviera';
const ANNOTATIONS_URL = BASE_URL + 'v0/annotations';
const SNPS_URL = BASE_URL + 'v0/snps';

class App extends Component {
	
	constructor(props) {
		super(props); 
		this.state = {
			gwas: [], 
			annotations: [],
			snps: [],
			selected_gwas: '',
			posteriors: {},
		}; 
		this.populate_data();
	}

	get_API_data(data_label, URL) {
		$.ajax({
			contentType: 'application/json',
			url: URL,
			type: 'GET',
			success: function(result) {
				//Popuplate the app's state with the result of the call 
				var data = result.results; 
				var data_obj = {}; 
				data_obj[data_label] = data
				this.setState(data_obj); 
			}.bind(this),
			error: function(err) {
				console.log(err)
			}.bind(this)
		});
	}

	get_gwas_options() {
		this.get_API_data('gwas', GWAS_URL)
	}

	get_annotations() {
		this.get_API_data('annotations', ANNOTATIONS_URL)
	}

	get_snps() {
		this.get_API_data('snps', SNPS_URL);
	}

	populate_data() {
		this.get_gwas_options();
		this.get_annotations(); 
		this.get_snps();
	}

	get_weightings(trait_id) {
		if (!trait_id) {
			return
		};

		var data = {
			trait: parseInt(trait_id)
		}; 

		$.ajax({
			contentType: 'application/json',
			url: WEIGHTS_URL, 
			type: 'POST',
			data: JSON.stringify(data),
			success: function(result) {
				//generate d3 graph
				var posteriors = result.results.posteriors;
				this.setState({posteriors: posteriors});
			}.bind(this), 
			error: function(err) {
				console.log(err);
			}
		});
	}

	onSubmit(trait_id) {
		this.setState({
			selected_gwas: trait_id
		}); 
		this.get_weightings(trait_id);
	}

  	render() {
	    return (
	      <div className="App">
	        <UserInp options={this.state.gwas} defaultMessage='Select an annotation' onSubmit={this.onSubmit.bind(this)}/>
	      	<Graph snps={this.state.snps} posteriors={this.state.posteriors}/>
	      </div>
	    );
	}
}

export default App;
