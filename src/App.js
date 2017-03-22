import React, { Component } from 'react';
import UserInp from './components/UserInp/component.js';
//import Graph from './components/Graph/component.js';
import Riviera from './components/Riviera/component.js'; 
//import Output from './components/Output/component.js';
import APICalls from './helpers/APICalls.js'; 
import './App.css';

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

	setFetchedData(APIResult, stateLabel) {
		var data = APIResult.results; 
		var dataObject = {}; 
		dataObject[stateLabel] = data
		this.setState(dataObject); 
	}

	getGwas() {
		APICalls.getGwasData()
		.done(function(result) {
			this.setFetchedData(result, 'gwas');
		}.bind(this))
	}

	getAnnotations() {
		APICalls.getAnnotationsData()
		.done(function(result) {
			this.setFetchedData(result, 'annotations');
		}.bind(this))
	}

	populate_data() {
		this.getGwas();
		this.getAnnotations(); 
	}

	getPriors() {
		return APICalls.getPriors(this.state.selectedGwas);
	}

	getPosteriors(priorData) {
		return APICalls.getPosteriors(priorData);
	}

	onSubmit(userSelections) {
		this.setState({
			selectedGwas: userSelections.selectedGwas,
			selectedAnnotations: userSelections.selectedAnnotations
		}, function() {
			this.getPriors()
			.done(function(response) {
				this.setState({
					traitId: response.results.traitId
				});
				return this.getPosteriors(response.results); 
			}.bind(this))
			.done(function(response) {
				this.setState({
					firstSubmit: true,
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
	        		<Riviera trait={this.state.traitId}/>
	        		{/*<Output/>*/}
	        	</div>
	        }
	      	{/*<Graph snps={this.state.snps} posteriors={this.state.posteriors}/> -->*/}
	      </div>
	    );
	}
}

export default App;
