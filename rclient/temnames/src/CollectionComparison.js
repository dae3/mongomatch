import React from 'react';

class CollectionComparison extends React.Component {

	render() {
		return (
			<div className="CollectionComparison">
				<h1>CollectionComparison</h1>
				{this.props.apiData && 
						<div>{JSON.stringify(this.props.apiData)}</div>
				}
			</div>
		);
	}
}


export default CollectionComparison;
