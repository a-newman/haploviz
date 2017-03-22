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
			firstSubmit: false,
			//snps: [],
			posteriors: {}
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
		console.log("getting posteriors");
		return APICalls.getPosteriors(priorData)
		.done(function(result) {
			console.log("posterior data result", result);
			this.setFetchedData(result, 'posteriors');
		}.bind(this));
	}

	onSubmit(userSelections) {
		this.setState({
			selectedGwas: userSelections.selectedGwas,
			selectedAnnotations: userSelections.selectedAnnotations
		}, function() {
			this.getPriors()
			.done(function (response) {
				return this.getPosteriors(response.results); 
			}.bind(this))
			.done(function(response) {
				this.setState({
					firstSubmit: true,
				})
			}.bind(this)) ;
		});
	}

	onReRun() {
		// it needs to put the prior data back into the prior function 
		//get the prior data and put it back into posteriors. So you need to save the posterior data somewhere
		var priors = {
			studyId: this.state.posteriors.studyId,
			weights: this.state.posteriors.weights,
			priors: this.state.posteriors.posteriors
		}
		return this.getPosteriors(priors);
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
	        		<Riviera 
	        			trait={this.state.posteriors.traitId}
	        			onReRun={this.onReRun.bind(this)}
	        		/>
	        		{/*<Output/>*/}
	        	</div>
	        }
	      	{/*<Graph snps={this.state.snps} posteriors={this.state.posteriors}/> -->*/}
	      </div>
	    );
	}
}

export default App;
