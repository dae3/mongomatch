import React from 'react';

function CollectionData(props) {
	const { apiData, apiLoading } = props;

	return (
		<div>
			{ apiLoading ? <p>loading...</p> :
					<div>
						{ apiData.length === 0 ? null :
								Object.keys(apiData[0]).slice(0,5).map(d =>
									<li key={d}>{d}</li>
								)
						}
					</div>
			}
		</div>
	)
}

export default CollectionData;
