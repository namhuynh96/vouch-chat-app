import { useEffect, useState, useRef, useCallback } from "react";
import socketIOClient from "socket.io-client";

import { UpArrow } from "../../shared/Icon";
import { useFetch } from "../../hooks/useHttp";

import classes from "./Chat.module.css";

const host = process.env.REACT_APP_BACKEND_URL;

const Chat = ({ roomDetails, onExit }) => {
  const { roomId, userId, roomName } = roomDetails;

  const [messages, setMessages] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  const { sendRequest } = useFetch();

  const socketRef = useRef();
  const messagesEnd = useRef();

  const handleLogout = useCallback(() => {
    sendRequest(`/room/exit?userId=${userId}`, "POST")
      .then(() => {})
      .catch(() => {});
    socketRef.current.disconnect();
  }, [userId, sendRequest]);

  useEffect(() => {
    sendRequest(`/room/messages?roomId=${roomId}&userId=${userId}`).then(
      (res) => setMessages(res.data.messages)
    );

    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on(`serverMessageForRoom ${roomId}`, (data) => {
      setMessages((oldMsgs) => [...oldMsgs, data.message]);
    });

    window.addEventListener("beforeunload", handleLogout);

    return () => {
      socketRef.current.disconnect();
      window.removeEventListener("beforeunload", handleLogout);
    };
  }, [roomId, userId, handleLogout, sendRequest]);

  useEffect(() => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const _onSend = () => {
    if (messageInput.trim().length === 0) {
      return;
    }

    socketRef.current.emit("clientMessage", {
      roomId,
      userId,
      message: messageInput,
    });
    setMessageInput("");
  };

  const renderMessages = messages?.map((message) => {
    return (
      <div
        key={message._id}
        className={
          message.userOwner._id === userId
            ? classes.userMessage
            : classes.otherMessage
        }
      >
        {message.userOwner._id !== userId && (
          <div className={classes.username}>{message.userOwner.username}</div>
        )}
        <div className={classes.message}>{message.message}</div>
      </div>
    );
  });

  const _onExit = () => {
    handleLogout();
    onExit();
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <button className={classes.exitBtn} onClick={_onExit}>
          Exit
        </button>
        <div className={classes.roomName}>{roomName}</div>
      </div>

      <div className={classes.messages}>
        {renderMessages}
        <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
      </div>

      <div className={classes.inputContainer}>
        <div className={classes.inputWrapper}>
          <input
            placeholder="Message here..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={_onSend}>
            <UpArrow />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
