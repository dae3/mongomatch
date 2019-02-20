import React from 'react'; 
import Button from 'react-bootstrap/lib/Button';
import CollectionData from './CollectionData';
import Panel from 'react-bootstrap/lib/Panel';
import withApi from './withApi';

class CollectionCSVExport extends React.Component {
	constructor(props) {
		super(props);
		this.buttonClick = this.buttonClick.bind(this);
	}

	render() {
		const { collection, apiHost, apiPort } = this.props;
		const CollectionDataWithApi = withApi(CollectionData);

		return(
						<Button
							bsStyle="danger"
							onClick={this.buttonClick}
							value={collection}>
							Export as CSViee
						</Button>
		);
	}

	buttonClick(event) {
		const { apiHost, apiPort } = this.props;
	}
}

export default DeleteButton;
