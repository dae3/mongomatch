import React from 'react';
import CollectionSelector from './CollectionSelector';

class CollectionList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			collectionNames : ['collection1','collection2','collection3'],
			idxSel1 : 0,
			idxSel2 : 0
		}

		this.deleteButtonClick = this.deleteButtonClick.bind(this);
		this.selectionChange = this.selectionChange.bind(this);
	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	selectionChange(id, selectedValue) {
		const stateObj = {};
		stateObj['idxSel'+id] = selectedValue;
		this.setState(stateObj);
	}

	deleteButtonClick(event) {
		console.log(`you deleted ${event.target.value}`);
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
			<CollectionSelector id="1" onChange={this.selectionChange} collectionNames={this.state.collectionNames}/>
			<CollectionSelector id="2" onChange={this.selectionChange} collectionNames={this.state.collectionNames}/>
			<p>{this.state.idxSel1},{this.state.idxSel2}</p>
			</div>
		);
	}
}

export default CollectionList;


