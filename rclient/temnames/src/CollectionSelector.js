import React from 'react';
import './CollectionSelector.css';

class CollectionSelector extends React.Component {
	constructor(props) {
		super(props);

		this.handleSelect = this.handleSelect.bind(this);
	}

	handleSelect(event) {
		this.props.onChange(this.props.id, event.target.value);
	}

	render() {
		const cnWithDummy = ['-Select-',...this.props.collectionNames];
		const selectOptions = cnWithDummy.map((n) => <option key={n} value={n}>{n}</option>);

		return (
			<div className="CollectionSelector">

				<select id={this.props.id}
					onChange={this.handleSelect}>
					{selectOptions}
				</select>
			</div>
		);
	}
}

export default CollectionSelector;
