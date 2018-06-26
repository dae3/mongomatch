import React from 'react'; 
import Button from 'react-bootstrap/lib/Button';
import CollectionData from './CollectionData';
import withApi from './withApi';

class DeleteButton extends React.Component {
	constructor(props) {
		super(props);
		this.deleteButtonClick = this.deleteButtonClick.bind(this);
	}

	render() {
		const { collection } = this.props;
		const CollectionDataWithApi = withApi(CollectionData);

		return(
			<React.Fragment>
				<p>{collection}</p>
				<CollectionDataWithApi dataUrl={`/collection/${collection}`} />
				<Button onClick={this.deleteButtonClick} value={collection}>
					Delete 
				</Button>
			</React.Fragment>
		);
	}

	deleteButtonClick(event) {
		fetch(
			`http://localhost:8081/collection/${event.target.value}`,
			{ method : 'DELETE' }
		).then(res => this.props.apiReload());
	}
}

export default DeleteButton;
