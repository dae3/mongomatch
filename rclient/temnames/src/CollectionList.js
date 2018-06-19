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
			leftCollection : undefined,
			rightCollection : undefined
		}

		this.deleteButtonClick = this.deleteButtonClick.bind(this);
		this.selectionChange = this.selectionChange.bind(this);
	}

	selectionChange(id, selectedValue) {
		this.setState( { [id] : selectedValue } );
	}

	deleteButtonClick(event) {
		fetch(
			`http://localhost:8081/collection/${event.target.value}`,
			{ method : 'DELETE' }
		).then(res => this.props.apiReload());
	}

	render() {
		const CollectionComparisonWithApi = withApi(CollectionComparison);
		//const readyToCompare = this.state.collections[0].name !== undefined && this.state.collections[1].name !== undefined;

		return (
			<div className="CollectionList row">
				<CollectionUploader apiReload={this.props.apiReload}/>
				<ul>
					{this.props.apiData.map( col =>  
						<li key={col}> <button value={col} onClick={this.deleteButtonClick}>Delete</button> &nbsp; {col} </li>
					)}
				</ul>
				<CollectionSelector id="leftCollection" onChange={this.selectionChange} value={this.state.leftCollection} collectionNames={this.props.apiData} />
				<CollectionSelector id="rightCollection" onChange={this.selectionChange} value={this.state.rightCollection} collectionNames={this.props.apiData} />
				{ this.state.leftCollection !== undefined && this.state.rightCollection !== undefined &&
						<div>
							<CollectionComparisonWithApi
								dataUrl={`/scoreCrossmatch/${this.state.leftCollection}/${this.state.rightCollection}`} />
						</div>
				}
			</div>
		);
	}
}

export default CollectionList;


