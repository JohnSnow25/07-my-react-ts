import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import HomePage from "./pages/home";
import LoginPage from "./pages/login";

export default () => {
    return (
        <div>
            <HashRouter>
                <Switch>
                    <Route path="/" exact component={ HomePage }/>
                    <Route path="/login" exact component={ LoginPage }/>
                </Switch>
            </HashRouter>
        </div>
    )
}

