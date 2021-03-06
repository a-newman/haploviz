import $ from 'jquery'; 

const BASE_URL = 'http://128.52.171.248/'; 
const GWAS_URL = BASE_URL + 'v0/gwasStudy'; 
//const WEIGHTS_URL = BASE_URL + 'v0/riviera';
const ANNOTATIONS_URL = BASE_URL + 'v0/annotations';
const SNPS_URL = BASE_URL + 'v0/snps';
const PRIOR_URL = BASE_URL + 'v1/fineMapping/prior/basic'; 
const RIVIERA_URL = BASE_URL + 'v1/fineMapping/prior/riviera';
const POSTERIOR_URL = BASE_URL + 'v1/fineMapping/posterior/basic';
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

	getSNPData() {
		return this.getAPIData(SNPS_URL);
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

	getPriors(gwasId, annotationIds) {
		var data = {
			"studyId": parseInt(gwasId),
		}; 
		//if annotationIds is non-empty, add it as a trait
		if (annotationIds != null && annotationIds.length && annotationIds.length > 0) {
			data["annotationIds"] = annotationIds;
		} 
		console.log("data to post", data); 
		return $.ajax({
			contentType: 'application/json',
			url: RIVIERA_URL,
			type: 'POST',
			data: JSON.stringify(data),
			error: function(err) {
				console.log(err)
			}.bind(this)
		})
	},

	getPosteriors(priorData) { 
		//make sure that phi is a float, as required
		console.log("priorDatanext", priorData.next);
		var data = {
			"studyId": priorData.studyId,
			"latentVariables": priorData.latentVariables,
			"next": priorData.next
		}

		var stringifiedData = JSON.stringify(data);
		//matches the string: "phi":<number>
		var phiRegex = new RegExp('"phi":\\d+\\.?\\d*'); 
		var match = phiRegex.exec(stringifiedData);
		//if phi is in integer form, change it to a float
		if (match[0].indexOf(".") == -1) {
			var stringifiedData = stringifiedData.replace(phiRegex, match[0] + ".0");
		}

		return $.ajax({
			contentType: 'application/json',
			url: POSTERIOR_URL,
			type: 'POST',
			data: stringifiedData,
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