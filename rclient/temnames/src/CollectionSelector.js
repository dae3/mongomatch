import React from 'react';

class CollectionSelector extends React.Component {
	constructor(props) {
		super(props);

		this.handleSelect = this.handleSelect.bind(this);
	}

	handleSelect(event) {
		this.props.onChange(this.props.id, event.target.value);
	}

	render() {
		let i = 0;
		const cnWithDummy = ['-Select-',...this.props.collectionNames];
		const selectOptions = cnWithDummy.map((n) =>
					<option key={n} value={i++}>{n}</option>)
				
		return (
			<select onChange={this.handleSelect}>
				{selectOptions}
			</select>
		);
	}
}

export default CollectionSelector;
