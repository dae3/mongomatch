import React from 'react';
import CollectionComparisonRow from './CollectionComparisonRow.js';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Checkbox from 'react-bootstrap/lib/Checkbox';

class CollectionComparison extends React.Component {
	constructor(props) {
		super(props);

		this.thresholdChange = this.thresholdChange.bind(this);
		this.hnmChange = this.hnmChange.bind(this);
		this.state = { hideNoMatch : true, threshold : undefined };
	}

	thresholdChange(event) {
		this.setState( { threshold : event.target.value } )
	}

	hnmChange(event) {
		this.setState( { hideNoMatch : event.target.checked } )
	};

	componentDidUpdate(prevProps) {
		// once we have the data, calculate the highest match score
		if (this.state.thresholdRange === undefined && this.props.apiData.length > 0) {
			const thresholdRange = this.props.apiData
				.map( row => row.matchedNames.map( mn => mn.score ) )
				.reduce( (a, v) => a.concat(v), [] )
				.reduce( (a, v) => Math.max(a, v), 0 );

			this.setState( {
				thresholdRange : thresholdRange,
				threshold : Math.floor(thresholdRange / 2)
			})
		}
	}

	render() {
		const { apiData } = this.props;

		return(
			<Grid>
				<Row>
					<Col xs={1}>less</Col>
					<Col xs={6}>
						<input
							type="range"
							min="0"
							value={this.state.threshold || 0}
							max={this.state.thresholdRange}
							onChange={this.thresholdChange}
						/>
					</Col>
					<Col xs={1}>more</Col>
					<Col xs={4}>
						<Checkbox onChange={this.hnmChange} checked={this.state.hideNoMatch} value="foo">
							Hide names with no matches
						</Checkbox>
					</Col>
				</Row>

				{apiData.map( row =>
					<CollectionComparisonRow
						key={row.name}
						hideNoMatch={this.state.hideNoMatch}
						rowData={row}
						threshold={this.state.threshold} />
				)}
			</Grid>
		)
	}
}


export default CollectionComparison;
