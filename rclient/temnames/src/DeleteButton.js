import React from 'react'; 
import Button from 'react-bootstrap/lib/Button';

class DeleteButton extends React.Component {
	constructor(props) {
		super(props);
		this.deleteButtonClick = this.deleteButtonClick.bind(this);
	}

	render() {
		const { collection } = this.props;

		return(
			<Button
				onClick={this.deleteButtonClick}
				value={collection}>Delete {collection}
			</Button>
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
