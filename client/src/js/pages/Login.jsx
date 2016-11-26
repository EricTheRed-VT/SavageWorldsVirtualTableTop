import {PageHeader} from "bootstrap-react-components";
import React from "react";
import {push} from "react-router-redux";
import {connect} from "react-redux";

class Login extends React.Component {

	login() {
		this.props.dispatch(push("/register"));
	}

	render() {
		return (
				<div id="LoginPage">
					<PageHeader id="Login">
						<h1>Login</h1>
					</PageHeader>
					<button onClick={this.login.bind(this)}>Login</button>
				</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);