import React from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';

class CollectionUploader extends React.Component {
	constructor(props) {
		super(props);

		this.upload = this.upload.bind(this);
		this.handleEvent = this.handleEvent.bind(this);
		this.handleFileChange = this.handleFileChange.bind(this);

		this.state = {
			filename : "",
			collection : "",
			sheet : "",
			namefield: "",
			readyToUpload : false
		};
	}

	handleEvent(event) {
		this.setState({ [event.target.name] : event.target.value });
	}

	handleFileChange(event) {
		this.setState({
			filename : event.target.files[0] === undefined ? "" : event.target.files[0].name,
		});

		this.file = event.target.files[0];
	}

	componentDidUpdate() {
		const rtu =
			this.state.sheet !== "" &&
			this.state.collection !== "" &&
			this.state.namefield !== "" &&
			this.state.filename !== "";

		if (rtu !== this.state.readyToUpload) {
			this.setState( { readyToUpload : rtu } );
		}
	}

	upload() {
		const formData = new FormData();
		formData.append('namefield', this.state.namefield);
		formData.append('sheet', this.state.sheet);
		formData.append('file', this.file);

		const { apiHost, apiPort } = this.props;

		fetch(
			`http://${apiHost}:${apiPort}/collection/${this.state.collection}`,
			{
				method : 'POST',
				body : formData,
				mode : 'cors'
			}
		)
			.then(response => { response.ok && this.props.apiReload() })
			.catch(error => console.log(error));
	}

	render() {
		return(
			<div>

					<FormGroup controlId="collection" validationState={this.state.collection !== "" ? "success" : "error"}>
						<ControlLabel>Collection name</ControlLabel>
						<FormControl type="text" onChange={this.handleEvent} name="collection" />
						<FormControl.Feedback />
					</FormGroup>

					<FormGroup controlId="collection" validationState={this.state.sheet !== "" ? "success" : "error"}>
						<ControlLabel>Worksheet name</ControlLabel>
						<FormControl type="text" onChange={this.handleEvent} name="sheet" />
						<FormControl.Feedback />
					</FormGroup>

					<FormGroup controlId="namefield" validationState={this.state.namefield !== "" ? "success" : "error"}>
						<ControlLabel>Name field</ControlLabel>
						<FormControl type="text" onChange={this.handleEvent} name="namefield" />
						<FormControl.Feedback />
					</FormGroup>

					<FormGroup controlId="file" validationState={this.state.filename !== "" ? "success" : "error"}>
						<ControlLabel>File to upload</ControlLabel>
						<FormControl type="file" onChange={this.handleFileChange} />
						<FormControl.Feedback />
					</FormGroup>

					<Button onClick={this.upload} disabled={!this.state.readyToUpload} bsStyle="primary">Upload</Button>
			</div>
		);
	}
}

export default CollectionUploader;
