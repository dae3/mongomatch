import React from 'react'; 
import CollectionUploader from './CollectionUploader';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import DeleteButton from './DeleteButton';

export default function CollectionManager({ apiData, apiReload }) {
	return(
			<Grid>
				<Row className="show-grid">
					<Col xs={6}> <CollectionUploader apiReload={apiReload}/> </Col>
					<Col xs={6}>
						{apiData.map( col =>
							<React.Fragment key={col}>
								<DeleteButton apiReload={apiReload} collection={col} />
								<br />
							</React.Fragment>)
						}
					</Col>
				</Row>
			</Grid>
	)
}
