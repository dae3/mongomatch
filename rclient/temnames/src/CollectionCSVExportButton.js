import React from 'react'; 
import Button from 'react-bootstrap/lib/Button';

class CollectionCSVExportButton extends React.Component {
	constructor(props) {
		super(props);
		this.buttonClick = this.buttonClick.bind(this);
	}

	render() {
		return(
			<div>
				<Button
					bsStyle="primary"
					onClick={this.buttonClick}
					href={`http://${this.props.apiHost}:${this.props.apiPort}/scoreCrossmatch/${this.props.left}/${this.props.right}?format=csv&unroll=matchedNames&filename=comparison.csv`}>
					Export as CSV
				</Button>
			</div>
		);
	}

	buttonClick(event) {
		window.location = "";
	}
}

export default CollectionCSVExportButton;
