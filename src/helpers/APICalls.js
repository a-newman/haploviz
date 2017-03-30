import $ from 'jquery'; 

const BASE_URL = 'http://128.52.171.248/'; 
const GWAS_URL = BASE_URL + 'v0/gwasStudy'; 
//const WEIGHTS_URL = BASE_URL + 'v0/riviera';
const ANNOTATIONS_URL = BASE_URL + 'v0/annotations';
const SNPS_URL = BASE_URL + 'v0/snps';
const PRIOR_URL = BASE_URL + 'v0/fineMapping/prior/basic'; 
const POSTERIOR_URL = BASE_URL + 'v0/fineMapping/posterior/basic';
const SNP_ANNOTATION_URL_ENDING = '/annotations';
const TRAITS_URL = BASE_URL + 'v0/traits'; 

var APICalls = {
	/**
	 * Re
	 * 
	*/
	getAPIData(URL) {
		return $.ajax({
			contentType: 'application/json',
			url: URL,
			type: 'GET',
			error: function(err) {
				console.log(err)
			}.bind(this)
		});
	},

	getGwasData() {
		return this.getAPIData(GWAS_URL)
	},

	getAnnotationsData() {
		return this.getAPIData(ANNOTATIONS_URL); 
	},

	getTraitsData() {
		return this.getAPIData(TRAITS_URL); 
	},

	set_SNP_annotations(snp, URL) {
		return $.ajax({
			contentType: 'application/json',
			url: URL,
			type: 'GET',
			error: function(err) {
				console.log(err)
			}.bind(this)
		});
	},

	getPriors(gwasId) {
		var data = {
			"studyId": parseInt(gwasId)
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
	},

	getPosteriors(priorData) { 
		return $.ajax({
			contentType: 'application/json',
			url: POSTERIOR_URL,
			type: 'POST',
			data: JSON.stringify(priorData),
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

}

module.exports = APICalls;