import React, { createRef } from "react";
import axios from "axios";
import makeToast from "../Toaster";
import { Link } from "react-router-dom";

const DashboardPage = (props) => {
    const chatroomNameRef = createRef();
    const [chatrooms, setChatrooms] = React.useState([]);
    const getChatrooms = () => {

        axios.get("http://localhost:8000/chatroom", {
            headers: {
                authorization: "Bearer " + localStorage.getItem("CC_Token"),
            },
        })
            .then((response) => {
                setChatrooms(response.data);
            })
            .catch((err) => {
                setTimeout(getChatrooms, 3000);
            });
    }


    const createChatroom = () => {
        console.log(localStorage.getItem("CC_Token"));

        const name = chatroomNameRef.current.value;
        axios.post("http://localhost:8000/chatroom", { name },
            {
                headers: {
                    authorization: "Bearer " + localStorage.getItem("CC_Token"),
                }
            }).then((res) => {
                getChatrooms();
                makeToast("success", res.data.message);
            }).catch((err) => {
                if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                )
                    makeToast("error", err.response.data.message);//response is different from res in above
            })
    }


    React.useEffect(() => {
        getChatrooms();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="card">
            <div className="cardHeader">Chatrooms</div>
            <div className="cardBody">
                <div className="inputGroup">
                    <label htmlFor="chatroomName">Chatroom Name</label>
                    <input
                        type="text"
                        name="chatroomName"
                        id="chatroomName"
                        placeholder="room name"
                        ref={chatroomNameRef}
                    />
                </div>
            </div>
            <button onClick={createChatroom}>Create Chatroom</button>
            <div className="chatrooms">
                {chatrooms.map((chatroom) => (
                    <div key={chatroom._id} className="chatroom">
                        <div>{chatroom.name}</div>
                        <Link to={"/chatroom/" + chatroom._id}>
                            <div className="join">Join</div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;