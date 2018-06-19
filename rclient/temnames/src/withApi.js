import React from 'react';

function withApi(Component) {
	return class extends React.PureComponent {
		constructor(props) {
			super(props);

			this.state = {
				data: [],
				loading: false,
				error: undefined
			};

			this.loadData = this.loadData.bind(this);
		}

		componentDidMount() { this.loadData() }

		loadData() {
			this.setState({ loading: true });
			this.req = fetch(`http://localhost:8081${this.props.dataUrl}`)
				.then(response => response.json()
					.then(data => this.setState({
						data: data,
						loading: false,
					}))
				)
				.catch(error => this.setState({ loading: false, error: error }))
		}

		render() {
			return(
				<Component
					apiData={this.state.data}
					apiLoading={this.state.loading}
					apiReload={this.loadData}
					apiError={this.state.error}
					{...this.props}
				/>
			);
		}
	}
}

export default withApi;
