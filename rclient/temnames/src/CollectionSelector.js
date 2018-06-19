import React from 'react';
import './CollectionSelector.css';
import CollectionData from './CollectionData';
import withApi from './withApi.js';

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
			<div>
				<select id={id} value={value} onChange={this.handleSelect}>
					{['-Select-',...collectionNames].map((n) =>
						<option key={n} value={n}>{n}</option>)}
				</select>
				{ value === undefined ? null :
						<CollectionDataWithApi dataUrl={`/collection/${value}`} />
				}
			</div>
		);
	}
}

export default CollectionSelector;
