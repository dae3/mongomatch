import React from 'react';

function CollectionData({ apiData : collectionData = [{}]}) {
		return ( collectionData.length === 0 ? null :
			Object.keys(collectionData[0]).slice(0,5).map(d => <li>{d}</li>)
		)
}

export default CollectionData;
