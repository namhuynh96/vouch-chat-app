import { useState } from "react";

import { useFetch } from "../../hooks/useHttp";

import classes from "./Join.module.css";

const Join = ({ onJoin }) => {
  const [usernameInput, setUsernameInput] = useState({
    value: "",
    error: null,
  });
  const [roomNameInput, setRoomNameInput] = useState({
    value: "",
    error: null,
  });
  const [serverErrorMessage, setServerErrorMessage] = useState(null);

  const { sendRequest } = useFetch();

  const _onJoin = () => {
    const username = usernameInput.value.trim();
    const roomName = roomNameInput.value.trim();
    if (username.length === 0 || roomName.length === 0) {
      if (username.length === 0)
        setUsernameInput((p) => ({ ...p, error: "Username cannot be empty" }));
      if (roomName.length === 0)
        setRoomNameInput((p) => ({ ...p, error: "RoomID cannot be empty" }));
      return;
    }
    setUsernameInput((p) => ({ ...p, error: null }));
    setRoomNameInput((p) => ({ ...p, error: null }));

    sendRequest(`/room?roomName=${roomName}&username=${username}`, "POST")
      .then((res) => onJoin(res.data.roomId, res.data.userId))
      .catch((e) => setServerErrorMessage(e.message));
  };

  return (
    <div>
      <div className={classes.header}>Join Chatroom</div>
      <div className={classes.inputsWrapper}>
        <input
          placeholder="Username"
          value={usernameInput.value}
          onChange={(e) =>
            setUsernameInput((p) => ({ ...p, value: e.target.value }))
          }
        />
        {usernameInput.error && (
          <div className="error">{usernameInput.error}</div>
        )}
        <input
          placeholder="RoomID"
          value={roomNameInput.value}
          onChange={(e) =>
            setRoomNameInput((p) => ({ ...p, value: e.target.value }))
          }
        />
        {roomNameInput.error && (
          <div className="error">{roomNameInput.error}</div>
        )}
        {serverErrorMessage && (
          <div className="error">{serverErrorMessage}</div>
        )}
      </div>

      <button className={classes.joinBtn} onClick={_onJoin}>
        JOIN
      </button>
    </div>
  );
};

export default Join;
