import React from 'react';
import './CollectionList.css';
import CollectionSelector from './CollectionSelector';
import CollectionData from './CollectionData';
//import CollectionComparison from './CollectionComparison';
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

		//const CollectionComparisonWithApi = withApi(CollectionComparison);
		const CollectionDataWithApi = withApi(CollectionData);

		return (
			<div className="CollectionList">
				<ul>{collectionListItems}</ul>
				<div className="CollectionListItems">
					{this.state.collections.map((collection,index) => (
						<div>
							<CollectionSelector
								id={index} key={index}
								onChange={this.selectionChange}
								collectionNames={this.props.apiData}
							/>
							<CollectionDataWithApi dataUrl={'/collection/' + collection.name} />
						</div>
					))};
				</div>
			</div>
		);
	}
}

export default CollectionList;


