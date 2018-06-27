import React from 'react';
import Popover from 'react-bootstrap/lib/Popover';
import Badge from 'react-bootstrap/lib/Badge';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

export default function CollectionComparisonRowItem({itemData}) {

	const dataPopover = 
		<Popover id="dataPopover" title="Data">
			<ul>
				{Object.keys(itemData).filter( k => !(['score','name'].includes(k))).map( key => <li key={key}>{key}: {itemData[key]}</li> )}
			</ul>
		</Popover>;

	return (
			<span> {itemData.name} <Badge>{itemData.score}</Badge> </span>
	);
}
	/*
		<OverlayTrigger trigger="click" placement="bottom" overlay={dataPopover}>
			<span> {itemData.name} <Badge>{itemData.score}</Badge> </span>
		</OverlayTrigger>
		*/
