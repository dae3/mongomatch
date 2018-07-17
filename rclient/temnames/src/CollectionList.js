import React from 'react';
import CollectionSelector from './CollectionSelector';
import CollectionComparison from './CollectionComparison';
import CollectionCSVExportButton from './CollectionCSVExportButton.js';
import withApi from './withApi.js';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';
import FileDownload from './FileDownload.js';

class CollectionList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			leftCollection : undefined,
			rightCollection : undefined,
			output : 'json'
		}

		this.selectionChange = this.selectionChange.bind(this);
		this.outputChange = this.outputChange.bind(this);
	}

	selectionChange(id, selectedValue) {
		this.setState( { [id] : selectedValue } );
	}

	outputChange(value) {
		this.setState( { output : value } );
	}

	render() {
		const CollectionComparisonWithApi= withApi(CollectionComparison);
		const { leftCollection : left, rightCollection : right, output } = this.state;
		const { apiData : data, apiHost, apiPort } = this.props;

		return (
			<Grid>
				<Row>
					<Col xs={6}>
						<CollectionSelector
							id="leftCollection" label="Compare..."
							onChange={this.selectionChange} value={left} collectionNames={data}
							apiHost={apiHost} apiPort={apiPort}
						/>
					</Col>
					<Col xs={6}>
						<CollectionSelector
							id="rightCollection" label="with..."
							onChange={this.selectionChange} value={right} collectionNames={data}
							apiHost={apiHost} apiPort={apiPort}
						/>
					</Col>
				</Row>
				<Row>
					<ToggleButtonGroup name="output" value={output} onChange={this.outputChange}>
						<ToggleButton value="json">Interactive comparison</ToggleButton><ToggleButton value="csv">CSV download</ToggleButton>
					</ToggleButtonGroup>
				</Row>
				{ left !== undefined && right !== undefined &&
						<Row>
							<Row>
								<CollectionCSVExportButton
									left={left} right={right} apiHost={apiHost} apiPort={apiPort} />
							</Row>
							<Row>
								<CollectionComparisonWithApi
									apiHost={apiHost} apiPort={apiPort}
									dataUrl={`/scoreCrossmatch/${left}/${right}`} />
							</Row>
						{ output === 'json' &&
							<CollectionComparisonWithApi apiHost={apiHost} apiPort={apiPort} dataUrl={`/scoreCrossmatch/${left}/${right}`} />
						}
						{ output === 'csv' &&
								<FileDownload defaultFilename="comparison.csv" url={`http://${apiHost}:${apiPort}/scoreCrossmatch/${left}/${right}?format=csv&unroll=matchedNames`} />
						}
						</Row>
				}
			</Grid>
		);
	}
}

export default CollectionList;
