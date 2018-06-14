import React from 'react';
import './CollectionList.css';
import CollectionSelector from './CollectionSelector';
import CollectionComparison from './CollectionComparison';

class CollectionList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			collectionNames : [],
			collections : [
				{ name : undefined, data : [] },
				{ name : undefined, data : [] }
			]
		}

		this.deleteButtonClick = this.deleteButtonClick.bind(this);
		this.selectionChange = this.selectionChange.bind(this);
	}

	componentDidMount() { this.getCollectionNames() }

	getCollectionNames() {
		fetch('http://localhost:8081/collections').then(res => 
			res.json().then(j => this.setState({collectionNames : j}))
		)
		.catch(e => {console.log(e)});
	}

	selectionChange(id, selectedValue) {
		const collections = this.state.collections;
		if (id <= this.state.collections.length) {
			fetch('http://localhost:8081/collection/'+selectedValue)
				.then(res => res.json())
				.then(data => {
					collections[id].name = selectedValue;
					collections[id].data = data;
					this.setState({ collections: collections });
				})
			.catch(e => { console.log(e) })
		}
	}

	deleteButtonClick(event) {
		const delReq = new Request(
			`http://localhost:8081/collection/${event.target.value}`,
			{ method : 'DELETE' }
		);
		fetch(delReq).then(res => this.getCollectionNames());
	}

	render() {
		const collectionListItems = this.state.collectionNames.map((n) =>
			<li key={n}>
				<button value={n} onClick={this.deleteButtonClick}>Delete</button>
				&nbsp;
				{n}
			</li>
		);

		return (
			<div className="CollectionList">
				<h1>CollectionList</h1>
				<ul>{collectionListItems}</ul>
				<div className="CollectionListItems">
					{this.state.collections.map((collection,index) => (
						<CollectionSelector
							id={index} key={index}
							onChange={this.selectionChange}
							collectionNames={this.state.collectionNames}
							collectionData={collection.data}
						/>
					))};
				</div>
				<CollectionComparison collections={this.state.collections}/>
			</div>
		);
	}
}

export default CollectionList;


