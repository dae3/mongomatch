import React from 'react';
import CollectionComparisonRow from './CollectionComparisonRow.js';

class CollectionComparison extends React.Component {
	constructor(props) {
		super(props);

		this.thresholdChange = this.thresholdChange.bind(this);
		this.state = { threshold : undefined };
	}

	thresholdChange(event) {
		this.setState( { threshold : event.target.value } )
	}

	render() {
		const { apiData, apiLoading } = this.props;

		const fields = apiData.length > 0 ?
			Object.keys(apiData[0]).filter( k => k !== 'matchedNames' ) :
			[];

		const thresholdRange = this.props.apiData
			.map( row => row.matchedNames.map( name => name.score ) )
			.reduce( (a, v) => a.concat(v), [] )
			.sort();

		const threshold = this.state.threshold ?
			this.state.threshold :
			thresholdRange[Math.floor(thresholdRange.length/2)]

		return (
			<div className="CollectionComparison">
				{ apiLoading ? <p>loading...</p> :
						apiData.length > 0 &&
						<div>
							<select multiple>
								{fields.map( f => <option value={f}>{f}</option> )}
							</select>
							less
							<input
								type="range"
								min="0"
								max={thresholdRange[thresholdRange.length-1]}
								value={threshold}
								onChange={this.thresholdChange}
							/>
							more
							<table>
								<tbody>
									{apiData.map( row =>
										<CollectionComparisonRow
											key={row.name}
											rowData={row}
											threshold={threshold}
										/>
									)}
								</tbody>
							</table>
						</div>
				}
			</div>
		);
	}
}


export default CollectionComparison;
