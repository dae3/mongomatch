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

				{this.props.collectionData.length > 0 &&
					<div>{this.props.collectionData.length} documents
						<ul>
							{Object.keys(this.props.collectionData[0]).slice(0,5).map((k) =>
								<li key={k}>{k}</li>)}
						</ul>
					</div>
				}

			</div>
		);
	}
}

export default CollectionSelector;
