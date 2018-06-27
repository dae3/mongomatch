import React from 'react';
import CollectionComparisonRow from './CollectionComparisonRow.js';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import { WindowScroller, List } from 'react-virtualized';
import 'react-virtualized/styles.css';

class CollectionComparison extends React.Component {
	constructor(props) {
		super(props);

		this.thresholdChange = this.thresholdChange.bind(this);
		this.hnmChange = this.hnmChange.bind(this);
		this.state = { hideNoMatch : true, threshold : undefined };
		this.listRef = undefined;
	}

	thresholdChange(event) {
		this.setState( { threshold : event.target.value } )
		this.listRef.recomputeRowHeights();
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

			this.listRef.recomputeRowHeights();
		}
	}

	render() {
		const { apiData, apiLoading } = this.props;
		const { threshold, thresholdRange, hideNoMatch } = this.state;
		const rowRender = ({ key, index, style }) => {
			return (
				<div key={key} style={style}>
					<CollectionComparisonRow
						style={style}
						key={apiData[index].name}
						hideNoMatch={hideNoMatch}
						rowData={apiData[index]}
						threshold={threshold} />
				</div>
			);
		};

		// very rough rule of 5 names per line
		const rowHeight = ({ index }) => {
			return Math.ceil(apiData[index].matchedNames
				.filter( m => m.score <= threshold ).length / 5) * 22 
		};

		if (apiLoading) { return null; }
		else {
			return(
				<Grid>
					<Row>
						<Col xs={1}>less</Col>
						<Col xs={6}>
							<input
								type="range"
								min="0" max={thresholdRange}
								value={threshold || 0}
								onChange={this.thresholdChange}
							/>
						</Col>
						<Col xs={1}>more</Col>
						<Col xs={4}>
							<Checkbox onChange={this.hnmChange} checked={hideNoMatch} value="foo">
								Hide names with no matches
							</Checkbox>
						</Col>
					</Row>
					<WindowScroller>
						{({ height, isScrolling, onChildScroll, scrollTop }) => (
							<List
								autoHeight height={height} rowCount={apiData.length} rowHeight={rowHeight} rowRenderer={rowRender} width={800}
								onScroll={onChildScroll} scrollTop={scrollTop} isScrolling={isScrolling} ref={(ref)=>this.listRef=ref}
							/>
						)}
					</WindowScroller>
				</Grid>
			)
		}
	}
}

export default CollectionComparison;
