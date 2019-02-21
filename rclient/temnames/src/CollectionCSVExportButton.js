import React from 'react'; 
import Button from 'react-bootstrap/lib/Button';

class CollectionCSVExportButton extends React.Component {
	constructor(props) {
		super(props);
		this.buttonClick = this.buttonClick.bind(this);
	}

	render() {
		return(
			<Button bsStyle="primary" onClick={this.buttonClick} >Export as CSV</Button>
		);
	}

	buttonClick(event) {
		window.location = `http://${this.props.apiHost}:${this.props.apiPort}/scoreCrossmatch/${this.props.left}/${this.props.right}?format=csv&unroll=matchedNames`;
	}
}

export default CollectionCSVExportButton;
