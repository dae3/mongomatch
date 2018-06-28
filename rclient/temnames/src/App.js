import React, { Component } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import CollectionList from './CollectionList';
import CollectionManager from './CollectionManager';
import { Redirect, BrowserRouter as Router, Route } from 'react-router-dom';
import withApi from './withApi.js';

class App extends Component {

	render() {
		const CollectionListWithApi = withApi(CollectionList);
		const CollectionManagerWithApi = withApi(CollectionManager);
		
		const apiHost = process.env.REACT_APP_APIHOST;
		const apiPort = process.env.REACT_APP_APIPORT;

		return (
			<React.Fragment>
				<Navbar>
					<Navbar.Header> <Navbar.Brand>mongomatch</Navbar.Brand> </Navbar.Header>
					<Nav>
						<NavItem href="/compare" eventKey={1}>Compare collections</NavItem>
						<NavItem href="/manage" eventKey={2}>Manage collections</NavItem>
					</Nav>
				</Navbar>

				<Router>
					<React.Fragment>
						<Route exact path="/" render={ () => <Redirect to='/compare' /> } />
						<Route path="/manage" render={ () =>
								<CollectionManagerWithApi dataUrl='/collections' apiHost={apiHost} apiPort={apiPort} />
						} />
						<Route path="/compare" render={ () =>
								<CollectionListWithApi dataUrl='/collections' apiHost={apiHost} apiPort={apiPort}/>
						} />
					</React.Fragment>
				</Router>
			</React.Fragment>
		);
	}
}

export default App;
