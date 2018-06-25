import React from 'react';
import CollectionComparisonRowItem from './CollectionComparisonRowItem.js';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import memoizeOne from 'memoize-one';

class CollectionComparisonRow extends React.Component {

	constructor(props) {
		super(props);

		this.sortedMatches = memoizeOne(
			this._sortedMatches,
			this.mequals
		);
	}

	render() {
		const {rowData, threshold, hideNoMatch} = this.props;

		this.threshold = threshold;
		const matches = this.filteredMatches(this.sortedMatches(rowData.matchedNames), threshold);
		this.maxScore = matches.length === 0 ? 0 : matches[matches.length-1].score;

		if (matches.length === 0 && hideNoMatch) {
			return null;
		} else {
			return (
				<Row>
					<Col xs={3}>{rowData.name}: {rowData.matchedNames.length}</Col>
					<Col xs={9}>
						{ matches.map( match => <CollectionComparisonRowItem itemData={match} key={match.name} />) }
					</Col>
				</Row>
			);
		}
	}

	filteredMatches(matches, threshold) {
		return matches.filter( m => m.score <= threshold )
	}

	_sortedMatches(matches) {
		// alpha sort, uniq (assuming alpha sort), score sort
		return matches
			.sort( (a, b) => {
				if (a.name < b.name) return -1 
				else if (a.name > b.name) return 1;
				else return 0
			})
			.reduce( (a, v) => a.length > 0 && v.name === a[a.length-1].name ? a : a.concat(v), [] )
			.sort( (a, b) => a.score - b.score )
	}

	mequals(a, b) {
		return (a.length === b.length) &&
			a.reduce((acc,v,i,arr) => acc && arr[i] === b[i], true)
	} 

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.hideNoMatch !== nextProps.hideNoMatch) {
			return true;
		} else {
			const nextfilteredMatches = this.filteredMatches(nextProps.rowData.matchedNames, nextProps.threshold);
			const nextMaxScore = nextfilteredMatches.length === 0 ? 0 :  nextfilteredMatches[nextfilteredMatches.length-1].score;
			if (this.threshold - nextProps.threshold === 0) { // no change, no refresh
				return false;
			} else if (this.threshold - nextProps.threshold < 0) { // threshold increase
				return nextProps.threshold >= nextMaxScore;
			} else if (this.threshold - nextProps.threshold > 0) { // threshold decrease 
				return nextProps.threshold <= this.maxScore;
			} else { 
				return true;
			}
		}
	}
}

export default CollectionComparisonRow;
