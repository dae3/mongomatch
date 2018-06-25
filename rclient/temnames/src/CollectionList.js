import React from 'react';
import CollectionSelector from './CollectionSelector';
import CollectionComparison from './CollectionComparison';
import CollectionUploader from './CollectionUploader';
import withApi from './withApi.js';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';

class CollectionList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			leftCollection : undefined,
			rightCollection : undefined
		}

		this.deleteButtonClick = this.deleteButtonClick.bind(this);
		this.selectionChange = this.selectionChange.bind(this);
	}

	selectionChange(id, selectedValue) {
		this.setState( { [id] : selectedValue } );
	}

	deleteButtonClick(event) {
		fetch(
			`http://localhost:8081/collection/${event.target.value}`,
			{ method : 'DELETE' }
		).then(res => this.props.apiReload());
	}

	render() {
		const CollectionComparisonWithApi = withApi(CollectionComparison);

		return (
			<Grid>
				<Row className="show-grid">
					<Col xs={6}> <CollectionUploader apiReload={this.props.apiReload}/> </Col>
					<Col xs={6}>
						{this.props.apiData.map( col =>
							<React.Fragment key={col}>
								<Button onClick={this.deleteButtonClick} value={col}>Delete {col}</Button>
								<br />
							</React.Fragment>)
						}
					</Col>
				</Row>
				<Row>
					<Col xs={6}>
						<CollectionSelector
							id="leftCollection" label="Compare..."
							onChange={this.selectionChange} value={this.state.leftCollection} collectionNames={this.props.apiData}
						/>
					</Col>
					<Col xs={6}>
						<CollectionSelector
							id="rightCollection" label="with..."
							onChange={this.selectionChange} value={this.state.rightCollection} collectionNames={this.props.apiData}
						/>
					</Col>
				</Row>
				{ this.state.leftCollection !== undefined && this.state.rightCollection !== undefined &&
						<Row>
							<CollectionComparisonWithApi
								dataUrl={`/scoreCrossmatch/${this.state.leftCollection}/${this.state.rightCollection}`} />
						</Row>
				}
			</Grid>
		);
	}
}

export default CollectionList;


