import React from 'react';
import CollectionData from './CollectionData';
import withApi from './withApi.js';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

class CollectionSelector extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleSelect = this.handleSelect.bind(this);
	}

	handleSelect(event) {
		this.props.onChange(this.props.id, event.target.value);
	}

	render() {
		const { collectionNames, id, value } = this.props;
		const CollectionDataWithApi = withApi(CollectionData);

		return (
			<FormGroup controlId={id}>
				<ControlLabel>{this.props.label}</ControlLabel>
				<FormControl
					componentClass="select" 
					value={value}
					onChange={this.handleSelect}>
					{['-Select-',...collectionNames].map((n) =>
						<option key={n} value={n}>{n}</option>)}
				</FormControl>
				{ value === undefined ? null :
						<CollectionDataWithApi dataUrl={`/collection/${value}`} />
				}
			</FormGroup>
		);
	}
}

export default CollectionSelector;
