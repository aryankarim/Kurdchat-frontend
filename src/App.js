import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ChatroomPage from "./pages/ChatroomPage";
import ProtectedRoute from "./pages/protectedroute";
import io from "socket.io-client";
import makeToast from "./Toaster";

function App() {

  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");
    if (token && !socket) {
      const newSocket = io("http://localhost:8000", {
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket Disconnected!");
      });


      newSocket.on("connect", () => {
        makeToast("success", "Socket Connected!");
      });

      setSocket(newSocket);
    }
  };

  React.useEffect(() => {
    setupSocket();
    //eslint-disable-next-line
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/"
          render={() => <IndexPage setupSocket={setupSocket} />}
          exact
        />

        <Route path="/register" component={RegisterPage} exact />
        <ProtectedRoute
          path="/dashboard"
          component={DashboardPage}
          exact
        />
        <ProtectedRoute
          path="/chatroom/:id"
          component={ChatroomPage}
          socket={socket}
          exact
        />

        <Route
          path="*"
          render={() => "NOT FOUND 404"}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
//npm config set ignore-scripts true