import React from 'react';
import CollectionSelector from './CollectionSelector';
import CollectionComparison from './CollectionComparison';
import withApi from './withApi.js';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';

class CollectionList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			leftCollection : undefined,
			rightCollection : undefined
		}

		this.selectionChange = this.selectionChange.bind(this);
	}

	selectionChange(id, selectedValue) {
		this.setState( { [id] : selectedValue } );
	}

	render() {
		const CollectionComparisonWithApi = withApi(CollectionComparison);
		const { leftCollection : left, rightCollection : right } = this.state;
		const { apiData : data } = this.props;

		return (
			<Grid>
				<Row>
					<Col xs={6}>
						<CollectionSelector
							id="leftCollection" label="Compare..."
							onChange={this.selectionChange} value={left} collectionNames={data}
						/>
					</Col>
					<Col xs={6}>
						<CollectionSelector
							id="rightCollection" label="with..."
							onChange={this.selectionChange} value={right} collectionNames={data}
						/>
					</Col>
				</Row>
				{ left !== undefined && right !== undefined &&
						<Row>
							<CollectionComparisonWithApi
								dataUrl={`/scoreCrossmatch/${left}/${right}`} />
						</Row>
				}
			</Grid>
		);
	}
}

export default CollectionList;


