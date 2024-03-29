import React, { useState } from "react";

const ChatroomPage = ({ match, socket }) => {
    const chatroomId = match.params.id;
    const [messages, setMessages] = useState([]);
    const messageRef = React.useRef();
    const [userId, setUserId] = useState("");


    const sendMessage = () => {
        if (socket) {
            socket.emit("chatroomMessage", {
                chatroomId,
                message: messageRef.current.value,
            });

            messageRef.current.value = "";
        } else {
            console.log(socket);
            console.log(match);
        }
    };

    React.useEffect(() => {
        const token = localStorage.getItem("KC_token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.id);
        }
        if (socket) {
            socket.on("newMessage", (message) => {
                const newMessages = [...messages, message];
                setMessages(newMessages);
            });
        }
        //eslint-disable-next-line
    }, [messages]);

    const leaveRoom = () => {
        if (socket) {
            socket.emit("leaveRoom", {
                chatroomId,
            });
        }
    }

    React.useEffect(() => {
        if (socket) {
            socket.emit("joinRoom", {
                chatroomId,
            });
        }

        return () => {
            //Component Unmount
            leaveRoom();
        };
        //eslint-disable-next-line
    }, []);

    return (
        <div className="chatroomPage">
            <div className="chatroomSection">
                <div className="cardHeader">Chatroom Name</div>
                <div className="chatroomContent">
                    {messages.map((message, i) => (
                        <div key={i} className="message">
                            <span className={userId === message.userId ? "ownMessage" : "otherMessage"}>
                                {message.name}:
                            </span>{" "}
                            {message.message}
                        </div>
                    ))}
                </div>
                <div className="chatroomActions">
                    <div>
                        <input
                            type="text"
                            name="message"
                            placeholder="say something!"
                            ref={messageRef}
                        />
                    </div>
                    <div>
                        <button className="join" onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatroomPage;