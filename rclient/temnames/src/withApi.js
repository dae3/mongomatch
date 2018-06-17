import React from 'react';

function withApi(Component) {
	return class extends React.Component {
		constructor(props) {
			super(props);

			this.state = { data: [] };

			this.loadData = this.loadData.bind(this);
		}

		componentDidMount() {
			this.loadData();
		}

		loadData() {
			fetch(`http://localhost:8081${this.props.dataUrl}`)
				.then(response => response.json()
					.then(data => this.setState({ data: data }))
				)
				.catch(error => console.log(error));
		}

		render() {
			return(
				<Component apiData={this.state.data} apiReload={this.loadData} {...this.props} />
			);
		}
	}
}

export default withApi;
