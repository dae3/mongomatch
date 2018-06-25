import React from 'react';
import './CollectionComparisonRowItem.css';
import Popover from 'react-bootstrap/lib/Popover';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

class CollectionComparisonRowItem extends React.PureComponent {

	render()  {
		const {itemData} = this.props;
		const dataPopover = 
			<Popover id="dataPopover" title="Data">
				<ul>
					{Object.keys(itemData).filter( k => !(['score','name'].includes(k))).map( key => <li key={key}>{key}: {itemData[key]}</li> )}
				</ul>
			</Popover>;

		return (
			<OverlayTrigger trigger="click" placement="bottom" overlay={dataPopover}>
				<span>
					{itemData.name}
					<span className="badge badge-info">{itemData.score}</span>
				</span>
			</OverlayTrigger>
		);
	}
}

export default CollectionComparisonRowItem;
