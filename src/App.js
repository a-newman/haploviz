import React, { Component } from 'react';
import $ from 'jquery'; 
import Loading from 'react-loading';
import UserInp from './components/UserInp/component.js';
import Graph from './components/Graph/component.js';
import Riviera from './components/Riviera/component.js'; 
//import Output from './components/Output/component.js';
import BarChart from './components/BarChart/component.js';
import APICalls from './helpers/APICalls.js'; 
import './App.css';

class App extends Component {

	constructor(props) {
		super(props); 
		this.state = {
			gwas: [], 
			annotations: [],
			selectedAnnotations: [],
			resultsReady: false,
			//snps: [],
			posteriorData: {}, 
			priorData: {}
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
		.then(function(result) {
			this.setFetchedData(result, 'gwas');
		}.bind(this))
	}

	getAnnotations() {
		APICalls.getAnnotationsData()
		.then(function(result) {
			this.setFetchedData(result, 'annotations');
		}.bind(this))
	}

	populate_data() {
		this.getGwas();
		this.getAnnotations(); 
	}

	getPriors() {
		var annotationIds = this.state.selectedAnnotations;
		return APICalls.getPriors(this.state.selectedGwas, annotationIds);
	}

	getPosteriors(priorData) {
		console.log("getting posteriors");
		return APICalls.getPosteriors(priorData)
		.then(function(result) {
			console.log("posterior data result", result);
			this.setFetchedData(result, 'posteriors');
		}.bind(this));
	}

	runOneIteration(priorData, posteriors) {
		function oneRound(lastIterationData, posteriors) {
			$.extend(posteriors, lastIterationData.posteriors);
			console.log("intermediate next", lastIterationData.next);
			console.log("intermediate posteriors", lastIterationData.posteriors);
			//if (lastIterationData.posteriors) {console.log("intermediate posteriors number", Object.keys(lastIterationData.posteriors).length)}
			
			if (lastIterationData.next === null) {
				//set the  new val of posteriors
				lastIterationData.posteriors = posteriors;
				return $.Deferred().resolve(lastIterationData);
			
			} else {
				//we need to do another round
				return APICalls.getPosteriors(lastIterationData)
					//and then run this recursive call again
					.then(function (result) {
						return oneRound(result.results, posteriors);
					});
			}
		}

		priorData.next = {
			locus: 0
		}
		return APICalls.getPosteriors(priorData)
			.then(function(result) {
				return oneRound(result.results, {});
			})
	}

	onSubmit(userSelections) {
		console.log("Selected annotation at time of submit:", userSelections.selectedAnnotations);
		this.setState({
			selectedGwas: userSelections.selectedGwas,
			selectedAnnotations: userSelections.selectedAnnotations
		}, function() {
			this.getPriors()
			.then(function (response) {
				this.setState({
					priorData: response.results
				});
				return this.runOneIteration(response.results);
			}.bind(this))
			.then(function(firstRoundResults) {
				console.log("First round weights", firstRoundResults.latentVariables.weights);
				console.log("First round posteroirs", firstRoundResults.posteriors); 
				console.log("First round posteriros size", Object.keys(firstRoundResults.posteriors).length);
				this.setState({
					resultsReady: true,
					posteriorData: firstRoundResults
				});
			}.bind(this))
		});
	}

	//TODO: fix this!!!!!
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
	        	alreadySubmitted={this.state.resultsReady}
	    />

	    var componentToShow = 
		    	this.state.resultsReady ? (
		    		<div>
					    <BarChart
							weights={this.state.posteriorData.latentVariables.weights}
					    />
					</div>
		    	) : (
		    		<div>
		    			<h2>Please wait while we do some calculations...</h2>
		    			<Loading type="spin" color="grey" height="100px" width="100px"/>
		    		</div>
		    	)

	    return (
	    	<div className="App">
	        	{userInputComponent}
	        	{componentToShow}
	        	<Graph 
					posteriorData={this.state.posteriorData}
					priorData={this.state.priorData}
				/>
	       	</div>

	    );
	}
}

export default App;
