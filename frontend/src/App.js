import { useState } from "react";

import Join from "./pages/Join/Join";
import Chat from "./pages/Chat/Chat";

import classes from "./App.module.css";

function App() {
  const [roomDetails, setRoomDetails] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const _onJoin = (roomId, userId, roomName) => {
    setRoomDetails({ roomId, userId, roomName });
    setShowChat(true);
  };

  return (
    <div className={classes.app}>
      {showChat ? (
        <Chat roomDetails={roomDetails} onExit={() => setShowChat(false)} />
      ) : (
        <Join onJoin={_onJoin} />
      )}
    </div>
  );
}

export default App;
