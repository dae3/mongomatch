import React from 'react';
import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';

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
			this.dismissError = this.dismissError.bind(this);
		}

		componentDidMount() { this.loadData() }

		dismissError() {
			this.setState( { error: undefined } );
			this.loadData();
		}

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
				<div>
					{this.state.error !== undefined && 
							<Alert bsStyle="danger">
								{this.state.error.message}
								<Button onClick={this.dismissError}>Try again</Button>
							</Alert>
					}
					<Component
						apiData={this.state.data}
						apiLoading={this.state.loading}
						apiReload={this.loadData}
						apiError={this.state.error}
						{...this.props}
					/>
				</div>
			);
		}
	}
}

export default withApi;
