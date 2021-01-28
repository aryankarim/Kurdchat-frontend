import React from "react";
import { withRouter } from "react-router-dom";
import makeToast from "../Toaster";
import auth from "../auth";

// re-render gives props.history, props.location, props.match
const IndexPage = (props) => {
    const emailRef = React.createRef();
    const passwordRef = React.createRef();

    const loginUser = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        auth.login(email, password).then((response) => {
            makeToast("success", response.data.message);
            localStorage.setItem("KC_token", response.data.token);
            props.history.push("/dashboard");
            props.setupSocket();

        }).catch((err) => {
            console.log(err);
        });

    };


    return (
        <div className="card">
            <div className="cardHeader">Login</div>
            <div className="cardBody">
                <div className="inputGroup">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="abc@example.com"
                        ref={emailRef}
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Your Password"
                        ref={passwordRef}
                    />
                </div>
                <button onClick={loginUser}>Login</button>
            </div>
        </div>
    );
};

export default withRouter(IndexPage);