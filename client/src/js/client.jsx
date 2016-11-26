import axios from "axios";
import {loginUserSuccess} from "./actions";
import {requireAuthentication} from "./components/AuthenticationComponent";
import Layout from "./components/layout";
import Login from "./pages/Login";
import PlotPoints from "./pages/PlotPointList";
import Register from "./pages/Register";
import store from "./Store";
import {browserHistory, IndexRoute, Route, Router} from "react-router";
import {Provider} from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import {syncHistoryWithStore} from "react-router-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

axios.create({
	validateStatus: function (status) {
		return status < 300;
	}
});

const history = syncHistoryWithStore(browserHistory, store);

const app = document.getElementById("app");

ReactDOM.render(
		<Provider store={store}>
			<Router history={history}>
				<Route path="/" component={Layout}>
					<IndexRoute component={requireAuthentication(PlotPoints)}></IndexRoute>
					<Route path="register" component={Register}/>
					<Route path="login" component={Login}/>
				</Route>
			</Router>
		</Provider>
		, app);

let token = localStorage.getItem("token");
if (token !== null) {
	store.dispatch(loginUserSuccess(token));
}