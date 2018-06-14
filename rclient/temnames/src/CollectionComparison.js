import React from 'react';

class CollectionComparison extends React.Component {

	render() {
		return (
			<div className="CollectionComparison">
				{this.props.collections.map(collection => collection.name)}
			</div>
		);
	}
}

export default CollectionComparison;
