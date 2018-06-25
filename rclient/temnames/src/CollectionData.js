import React from 'react';

export default function CollectionData({ apiData }) {
	return apiData.length === 0 ? null : (
		Object.keys(apiData[0]).slice(0,5).map(d =>
			<li key={d}>{d}</li>
		)
	)
}
