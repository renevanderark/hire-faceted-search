import React from "react";

import FacetedSearch from "./components/faceted-search";
import Results from "./components/results";

import resultsActions from "./actions/results";
import resultsStore from "./stores/results";
import queriesActions from "./actions/queries";
import queriesStore from "./stores/queries";

class FacetedSearchController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			queries: queriesStore.getState(),
			results: resultsStore.getState()
		};
	}

	componentDidMount() {
		queriesActions.setDefaults(this.props);
		resultsStore.listen(this.onStoreChange.bind(this));
		queriesStore.listen(this.onQueriesChange.bind(this));
		resultsActions.getAll();
	}

	componentWillUnmount() {
		resultsStore.stopListening(this.onStoreChange.bind(this));
		queriesStore.stopListening(this.onQueriesChange.bind(this));
	}

	onQueriesChange() {
		resultsActions.getResults();
	}

	onStoreChange() {
		this.setState({
			queries: queriesStore.getState(),
			results: resultsStore.getState()
		});
	}

	handleResultSelect(result) {
		this.props.onChange(result.toJS());
	}

	render() {
		let data = this.state.results.get("queryResults").size ?
			this.state.results.get("queryResults").last() :
			this.state.results.get("initResults");

		let facetedSearch = this.state.results.get("queryResults").size ?
			<FacetedSearch
				facetData={data}
				selectedValues={this.state.queries.get("facetValues")} /> :
			null;

		let results = (this.state.results.get("queryResults").size > 1) ?
			<Results
				facetData={data}
				onSelect={this.handleResultSelect.bind(this)} /> :
			null;

		return (
			<div className="hire-faceted-search">
				{facetedSearch}
				{results}
			</div>
		);
	}
}

FacetedSearchController.defaultProps = {
	sortFields: []
};

FacetedSearchController.propTypes = {
	onChange: React.PropTypes.func.isRequired,
	sortFields: React.PropTypes.array
};

export default FacetedSearchController;