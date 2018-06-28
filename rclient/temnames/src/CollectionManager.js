import React from 'react'; 
import CollectionUploader from './CollectionUploader';
import Panel from 'react-bootstrap/lib/Panel';
import DeleteButton from './DeleteButton';

export default function CollectionManager({ apiData, apiReload, apiHost, apiPort }) {
	return(
		<React.Fragment>
			<Panel>
				<Panel.Heading>Upload a new collection</Panel.Heading>
				<Panel.Body> <CollectionUploader apiHost={apiHost} apiPort={apiPort} apiReload={apiReload}/> </Panel.Body>
			</Panel>
			<Panel>
				<Panel.Heading>Delete collections</Panel.Heading>
				<Panel.Body>
					{apiData.map( col => <DeleteButton apiReload={apiReload} collection={col} apiHost={apiHost} apiPort={apiPort}/>) }
				</Panel.Body>
			</Panel>
		</React.Fragment>
	)
}
