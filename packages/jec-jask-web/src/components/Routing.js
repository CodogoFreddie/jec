import * as R from "ramda";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Tasks from "./Tasks";
import Pallete from "./Pallete";

const Routing = () => (
	<Router>
		<Switch>
			<Route path="/pallete" component={Pallete} />
			<Route component={Tasks} />
		</Switch>
	</Router>
);

export default Routing;
