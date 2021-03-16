import React from 'react'
import { Redirect, Route } from 'react-router-dom';
import auth from "../auth";

export default function ProtectedRoute({ component: Component, ...rest }) {

    return (
        <Route
            {...rest}
            render={props => {
                if (auth.isauthenticated()) {
                    return (<Component socket={rest.socket} {...props} />);//cuz routes cannot pass down costum props
                } else {
                    return (<Redirect
                        to={{
                            pathname: "/",
                            state: {
                                from: props.location
                            }
                        }} />);
                }
            }}
        />
    );
}
