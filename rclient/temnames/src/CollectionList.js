import React from 'react';
import './CollectionList.css';
import CollectionSelector from './CollectionSelector';
import CollectionComparison from './CollectionComparison';
import CollectionUploader from './CollectionUploader';
import withApi from './withApi.js';

class CollectionList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			collections : [
				{ name : undefined, data : [] },
				{ name : undefined, data : [] }
			]
		}

		this.deleteButtonClick = this.deleteButtonClick.bind(this);
		this.selectionChange = this.selectionChange.bind(this);
	}

	selectionChange(id, selectedValue) {
		const collections = this.state.collections;
		if (id <= this.state.collections.length) {
			collections[id].name = selectedValue;
			this.setState({ collections: collections });
		}
	}

	deleteButtonClick(event) {
		const delReq = new Request(
			`http://localhost:8081/collection/${event.target.value}`,
			{ method : 'DELETE' }
		);
		fetch(delReq).then(res => this.props.apiReload());
	}

	render() {
		const collectionListItems = this.props.apiData.map((n) =>
			<li key={n}>
				<button value={n} onClick={this.deleteButtonClick}>Delete</button>
				&nbsp;
				{n}
			</li>
		);

		const CollectionComparisonWithApi = withApi(CollectionComparison);
		const readyToCompare = this.state.collections[0].name !== undefined && this.state.collections[1].name !== undefined;
		const CollectionSelectorWithApi = withApi(CollectionSelector);
		const selector = this.state.collections.length === 0 ? null : 
					this.state.collections.map((collection,index) => (
						<div key={index}>
							<CollectionSelectorWithApi
								id={index} key={index}
								onChange={this.selectionChange}
								value={collection.name}
								dataUrl='/collections'
								collectionNames={this.props.apiData}
							/>
						</div>
					))

		return (
			<div className="CollectionList row">
				<CollectionUploader apiReload={this.props.apiReload}/>
				<ul>{collectionListItems}</ul>
				<div className="CollectionListItems col-md-4">
							{selector}
				</div>
				{ readyToCompare &&
						<div>
							<CollectionComparisonWithApi
								dataUrl={`/scoreCrossmatch/${this.state.collections[0].name}/${this.state.collections[1].name}`} />
						</div>
				}
			</div>
		);
	}
}

export default CollectionList;


