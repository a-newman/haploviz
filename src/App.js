import React, { Component } from 'react';
import $ from 'jquery'; 
import UserInp from './components/UserInp/component.js';
import Graph from './components/Graph/component.js';
import Riviera from './components/Riviera/component.js'; 
import Output from './components/Output/component.js';
import './App.css';

const BASE_URL = 'http://128.52.171.248/'; 
const GWAS_URL = BASE_URL + 'v0/gwasStudy'; 
const WEIGHTS_URL = BASE_URL + 'v0/riviera';
const ANNOTATIONS_URL = BASE_URL + 'v0/annotations';
const SNPS_URL = BASE_URL + 'v0/snps';
const PRIOR_URL = BASE_URL + 'v0/fineMapping/prior/basic'; 
const POSTERIOR_URL = BASE_URL + 'v0/fineMapping/posterior/basic';
const SNP_ANNOTATION_URL_ENDING = '/annotations';

class App extends Component {

	constructor(props) {
		super(props); 
		this.state = {
			gwas: [], 
			annotations: [],
			firstSubmit: false
			//snps: [],
			//posteriors: {},
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

	set_SNP_annotations(snp, URL) {
		$.ajax({
			contentType: 'application/json',
			url: URL,
			type: 'GET',
			success: function(result) {
				//Popuplate the app's state with the result of the call 
				var data = result.results; 
				console.log('data', data);
				snp.annotations = data; 
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

	/*get_snps() {
		this.get_API_data('snps', SNPS_URL);
	}*/

	get_snp_annotations(snp) {
		var url = SNPS_URL + '/' + snp.rsid + '/' + SNP_ANNOTATION_URL_ENDING;
		this.set_SNP_annotations(snp, url);
	}

	populate_data() {
		this.get_gwas_options();
		this.get_annotations(); 
		//this.get_snps();
	}

	getPriors() {
		var data = {
			"studyId": parseInt(this.state.selectedGwas)
			//annotationIds: [this.state.selectedAnnotations]
		}; 
		console.log("data to post", data); 
		return $.ajax({
			contentType: 'application/json',
			url: PRIOR_URL,
			type: 'POST',
			data: JSON.stringify(data),
			error: function(err) {
				console.log(err)
			}.bind(this)
		})
	}

	getPosteriors(priorData) {
		console.log("priorData", priorData); 
		return $.ajax({
			contentType: 'application/json',
			url: POSTERIOR_URL,
			type: 'POST',
			data: JSON.stringify(priorData),
			success: function(result) {
				console.log("data", result.results); 
			}.bind(this),
			error: function(err) {
				console.log(err)
			}.bind(this)
		})
	}

	/*get_weightings(trait_id) {
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
	}*/

	onSubmit(userSelections) {
		this.setState({
			selectedGwas: userSelections.selectedGwas,
			selectedAnnotations: userSelections.selectedAnnotations
		}, function() {
			console.log("state after submit", this.state);  
			this.getPriors()
			.done(function(response) {
				this.getPosteriors(response.results); 
			}.bind(this))
			.done(function(response) {
				this.setState({
					firstSubmit: true
				})
			}.bind(this)) ;
		});
		//this.get_weightings(trait_id);
	}

  	render() {
  		var userInputComponent = <UserInp 
	        	gwasOptions={this.state.gwas} 
	        	defaultGwasMessage='Select a GWAS to study' 
	        	annotationsOptions={this.state.annotations}
	        	defaultAnnotationsMessage='Select a set of annotations'
	        	onSubmit={this.onSubmit.bind(this)}
	    />

	    return (
	      <div className="App">
	        {userInputComponent}
	        {this.state.firstSubmit && //shows the riviera component if the user has already submitted once
	        	<div>
	        		<Riviera/>
	        		<Output/>
	        	</div>
	        }
	      	{/*<Graph snps={this.state.snps} posteriors={this.state.posteriors}/> -->*/}
	      </div>
	    );
	}
}

export default App;
