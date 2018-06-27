import React from 'react';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Pagination from 'react-bootstrap/lib/Pagination';

class CollectionData extends React.PureComponent {
	constructor(props) {
		super(props);

		const { keyLimit = 5 } = this.props;
		this.state = { record : 0, keyLimit : keyLimit, keyLimitIncreases : 0 }

		this.prevRecord = this.prevRecord.bind(this);
		this.nextRecord = this.nextRecord.bind(this);
		this.moreKeys = this.moreKeys.bind(this);
	}

	prevRecord() {
		const r = this.state.record;
		this.setState( { record : r > 0 ? r-1 : r } )
	}

	nextRecord() {
		const r = this.state.record;
		this.setState( { record : r < this.props.apiData.length ? r+1 : r } )
	}

	moreKeys() {
		this.setState( {
			keyLimit : this.state.keyLimit + this.keyLimitStep(this.state), 
			keyLimitIncreases: this.state.keyLimitIncreases + 1
		} )
	}

	keyLimitStep({ keyLimit, keyLimitIncreases }) {
		if (keyLimitIncreases  < 5) { return 1 }
		else if (keyLimitIncreases < 10) { return 5 }
		else { return 999 } // yeah this is lazy...
	}

	render() {
		const { apiData } = this.props;
		const { record, keyLimit } = this.state;

		const keys = apiData.length > 0 ?
			Object.keys(apiData[record]).slice(0, keyLimit)
			.map( key => <ListGroupItem key={key}> {key}: {apiData[record][key]} </ListGroupItem> )
			: undefined;
		const moreKey = apiData.length > 0 && keyLimit < Object.keys(apiData[record]).length ? <ListGroupItem key='__more' onClick={this.moreKeys}>more...</ListGroupItem> : undefined;

		return (
			<React.Fragment>
				<ListGroup> {keys} {moreKey} </ListGroup>
				<Pagination>
					<Pagination.Prev onClick={this.prevRecord} /><Pagination.Next onClick={this.nextRecord} />
				</Pagination>
			</React.Fragment>
		)
	}
}

export default CollectionData;
