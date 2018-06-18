import React, { Component } from 'react';
import CollectionList from './CollectionList';
import withApi from './withApi.js';

class App extends Component {
  render() {
		const CollectionListWithApi = withApi(CollectionList);
    return (
			<div className='container'>
				<CollectionListWithApi dataUrl='/collections' />
			</div>
    );
  }
}

export default App;
