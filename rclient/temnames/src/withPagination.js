import React from 'react';

function withPagination(Component) {
	return class extends React.PureComponent {
		constructor(props) {
			super(props);

			this.state = {
				pageSize: 10,
				page: 1
			};
		}

		render() {
			return(
				<Component
					apiData={
						this.props.apiData.slice(
							this.state.pageSize*(this.state.page-1), this.state.pageSize
						)
					}
					{...this.props}
				/>
			);
		}
	}
}

export default withPagination;
