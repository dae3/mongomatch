import React from 'react'; 
import Button from 'react-bootstrap/lib/Button';
import CollectionData from './CollectionData';
import Panel from 'react-bootstrap/lib/Panel';
import withApi from './withApi';

class DeleteButton extends React.Component {
	constructor(props) {
		super(props);
		this.deleteButtonClick = this.deleteButtonClick.bind(this);
	}

	render() {
		const { collection, apiHost, apiPort } = this.props;
		const CollectionDataWithApi = withApi(CollectionData);

		return(
			<Panel>
				<Panel.Heading>{collection}</Panel.Heading>
				<Panel.Body>
					<CollectionDataWithApi apiHost={apiHost} apiPort={apiPort} dataUrl={`/collection/${collection}`} />
					<div>
						<Button
							bsStyle="danger"
							onClick={this.deleteButtonClick}
							value={collection}>
							Delete
						</Button>
					</div>
				</Panel.Body>
			</Panel>
		);
	}

	deleteButtonClick(event) {
		const { apiHost, apiPort } = this.props;
		fetch(
			`http://${apiHost}:${apiPort}/collection/${event.target.value}`,
			{ method : 'DELETE' }
		).then(res => this.props.apiReload());
	}
}

export default DeleteButton;
