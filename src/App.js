import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import test from "./pages/test";
import ChatroomPage from "./pages/ChatroomPage";
import ProtectedRoute from "./pages/protectedroute";
import io from "socket.io-client";
import makeToast from "./Toaster";

function App() {
  console.log("inside App component");
  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    console.log("ing socket setup");
    const token = localStorage.getItem("KC_token");
    if (token && !socket) {
      const newSocket = io("http://localhost:8000", {
        query: {
          token: localStorage.getItem("KC_token"),
        },
      });

      newSocket.on("disconnect", () => {
        console.log(newSocket);
        setSocket(null);
        newSocket.close();
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket Disconnected!");
      });


      newSocket.once("connect", () => {
        console.log("connect");//the problem is that this executes twice
        makeToast("success", "Socket Connected!");
      });

      setSocket(newSocket);
    }
  };

  // React.useEffect(() => {
  //   setupSocket();
  //   //eslint-disable-next-line
  // }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/lol" component={test} />
        <Route
          path="/"
          render={() => <IndexPage setupSocket={setupSocket} />}
          exact
        />
        <Route path="/register" component={RegisterPage} exact />
        <ProtectedRoute path="/dashboard" component={DashboardPage} socket={socket} exact />
        <ProtectedRoute path="/chatroom/:id" component={ChatroomPage} socket={socket} exact />
        <Route path="*" render={() => "NOT FOUND 404"} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
//npm config set ignore-scripts true