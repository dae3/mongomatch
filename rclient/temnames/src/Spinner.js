import React from 'react';
import './Spinner.css';

export default function Spinner({text = 'loading'}) {
	return(
		<span>
			<span className="glyphicon glyphicon-refresh glyphicon-refresh-animate" />
			{text}
		</span>
	)
}
